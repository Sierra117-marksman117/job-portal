'use server';

import { prisma } from '@/lib/prisma';
import { calculateSkillFit } from '@/lib/matching';
import { revalidatePath } from 'next/cache';

export async function getJobsWithCompatibility(candidateSkills: string[]) {
  const jobs = await prisma.job.findMany({
    include: {
      company: true,
      applications: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return jobs.map((job) => {
    let requiredSkills: string[] = [];
    try {
      requiredSkills = JSON.parse(job.requiredSkills);
    } catch {
      requiredSkills = job.requiredSkills.split(',').map((s) => s.trim());
    }

    const fit = calculateSkillFit(candidateSkills, requiredSkills);

    return {
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      ctcMin: job.ctcMin,
      ctcMax: job.ctcMax,
      experienceYears: job.experienceYears,
      requiredSkills,
      company: {
        id: job.company.id,
        name: job.company.name,
        location: job.company.location,
        logo: job.company.logo || job.company.name.slice(0, 2).toUpperCase(),
        verified: job.company.verified,
      },
      applicationCount: job.applications.length,
      fit,
    };
  });
}

export async function applyToJob(jobId: string, candidateEmail: string) {
  const candidate = await prisma.user.findUnique({
    where: { email: candidateEmail },
  });

  if (!candidate) {
    throw new Error('Candidate not found');
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: true },
  });

  if (!job) {
    throw new Error('Job not found');
  }

  let candidateSkills: string[] = [];
  let requiredSkills: string[] = [];
  try {
    candidateSkills = JSON.parse(candidate.skills);
    requiredSkills = JSON.parse(job.requiredSkills);
  } catch {
    candidateSkills = candidate.skills.split(',').map((s) => s.trim());
    requiredSkills = job.requiredSkills.split(',').map((s) => s.trim());
  }

  const { score } = calculateSkillFit(candidateSkills, requiredSkills);

  // Check if application exists
  const existing = await prisma.application.findFirst({
    where: {
      jobId,
      candidateId: candidate.id,
    },
  });

  if (existing) {
    return { success: true, application: existing, alreadyApplied: true };
  }

  const application = await prisma.application.create({
    data: {
      jobId,
      candidateId: candidate.id,
      status: 'APPLIED',
      matchScore: score,
    },
  });

  // Log audit trail
  await prisma.auditLog.create({
    data: {
      eventType: 'APPLICATION',
      message: `Application submitted: ${candidate.name} applied to ${job.title} at ${job.company.name} (${score}% Match).`,
      metadata: JSON.stringify({ jobId, candidateId: candidate.id, score }),
    },
  });

  revalidatePath('/');
  return { success: true, application, alreadyApplied: false };
}

export async function updateApplicationStatus(applicationId: string, newStatus: string) {
  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { status: newStatus },
    include: { candidate: true, job: true },
  });

  await prisma.auditLog.create({
    data: {
      eventType: 'APPLICATION',
      message: `Application status updated: ${updated.candidate.name} is now [${newStatus}] for ${updated.job.title}.`,
      metadata: JSON.stringify({ applicationId, newStatus }),
    },
  });

  revalidatePath('/');
  return updated;
}

export async function updateCompanyKyc(companyId: string, verified: boolean) {
  const company = await prisma.company.update({
    where: { id: companyId },
    data: { verified },
  });

  await prisma.auditLog.create({
    data: {
      eventType: 'KYC_APPROVAL',
      message: `Corporate entity ${company.name} KYC ${verified ? 'APPROVED' : 'REJECTED'} by Super Admin.`,
      metadata: JSON.stringify({ companyId, verified }),
    },
  });

  revalidatePath('/');
  return company;
}

export async function getRecruiterPipeline(companyId?: string) {
  return await prisma.application.findMany({
    where: companyId ? { job: { companyId } } : undefined,
    include: {
      candidate: true,
      job: {
        include: { company: true },
      },
    },
    orderBy: {
      matchScore: 'desc',
    },
  });
}

export async function getAdminData() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const auditLogs = await prisma.auditLog.findMany({
    take: 20,
    orderBy: { timestamp: 'desc' },
  });

  const userCount = await prisma.user.count();
  const jobCount = await prisma.job.count();
  const applicationCount = await prisma.application.count();

  return {
    companies,
    auditLogs,
    stats: {
      userCount,
      jobCount,
      applicationCount,
    },
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  // Candidate specific
  title?: string;
  skills?: string[];
  experience?: number;
  location?: string;
  // Recruiter specific
  companyName?: string;
  companyLocation?: string;
  gstin?: string;
  // Admin specific
  adminKey?: string;
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  if (input.role === 'ADMIN' && input.adminKey && input.adminKey.trim() !== 'TG-ADMIN-2026') {
    throw new Error("Invalid Security Authorization Passkey. Use 'TG-ADMIN-2026' to authorize administrative provisioning.");
  }

  const bcrypt = await import('bcryptjs');
  const passwordHash = await bcrypt.hash(input.password || 'Demo@123', 10);

  let companyId: string | undefined = undefined;
  let createdCompany: { id: string; name: string; location: string; gstin: string | null; verified: boolean; logo: string | null } | undefined = undefined;

  // If registering as a Recruiter, create the Company entity in KYC_PENDING status
  if (input.role === 'RECRUITER' && input.companyName) {
    const company = await prisma.company.create({
      data: {
        name: input.companyName,
        location: input.companyLocation || 'Bengaluru, India',
        gstin: input.gstin || '29AABCF9999F1Z0',
        verified: false, // Must be approved by Super Admin
        logo: input.companyName.slice(0, 2).toUpperCase(),
      },
    });
    companyId = company.id;
    createdCompany = {
      id: company.id,
      name: company.name,
      location: company.location,
      gstin: company.gstin,
      verified: company.verified,
      logo: company.logo,
    };

    // Log KYC registration
    await prisma.auditLog.create({
      data: {
        eventType: 'KYC_APPROVAL',
        message: `New enterprise registration: ${company.name} (GSTIN: ${company.gstin}) submitted for KYC approval.`,
        metadata: JSON.stringify({ companyId: company.id }),
      },
    });
  }

  // Create the User
  const newUser = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      title: input.title || (input.role === 'CANDIDATE' ? 'Software Engineer' : input.role === 'RECRUITER' ? 'Talent Partner' : 'System Administrator'),
      skills: JSON.stringify(input.skills && input.skills.length > 0 ? input.skills : ['General Engineering']),
      experience: input.experience || (input.role === 'CANDIDATE' ? 2.0 : 5.0),
      location: input.location || 'Bengaluru, India',
      companyId,
    },
  });

  // Log Auth Audit Event
  await prisma.auditLog.create({
    data: {
      eventType: 'AUTH',
      message: `New ${input.role} account registered: ${newUser.name} (${newUser.email}). BCrypt password hash stored.`,
      metadata: JSON.stringify({ userId: newUser.id, role: newUser.role }),
    },
  });

  revalidatePath('/');
  return {
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      title: newUser.title,
      skills: input.skills || [],
      location: newUser.location,
      companyId: newUser.companyId,
    },
    company: createdCompany,
  };
}
