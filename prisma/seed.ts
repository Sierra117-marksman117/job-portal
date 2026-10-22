import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding TalentGrid India database...');

  // Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('Demo@123', 10);

  // 1. Seed Companies
  const finwave = await prisma.company.create({
    data: {
      name: 'FinWave Technologies',
      location: 'Bengaluru (HSR Layout)',
      gstin: '29AABCF1234F1Z5',
      verified: true,
      logo: 'FW',
    },
  });

  const kavach = await prisma.company.create({
    data: {
      name: 'Kavach Security Labs Private Limited',
      location: 'Gurugram (Cyber City)',
      gstin: '07AAACK1234F1Z9',
      verified: false, // Pending KYC for Admin Demo
      logo: 'KS',
    },
  });

  const nexus = await prisma.company.create({
    data: {
      name: 'Nexus Digital Cloud Labs',
      location: 'Pune (Kharadi)',
      gstin: '27AABCN8832Q1Z2',
      verified: false, // Pending KYC for Admin Demo
      logo: 'NX',
    },
  });

  // 2. Seed Personas
  const rohan = await prisma.user.create({
    data: {
      name: 'Rohan Sharma',
      email: 'rohan.sharma.dev@example.com',
      passwordHash: defaultPasswordHash,
      role: 'CANDIDATE',
      title: 'Senior Backend Systems Engineer',
      bio: 'SDE-2 at TechLabs India. Passionate about distributed ledger systems, query optimization, and resilient microservices.',
      skills: JSON.stringify(['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'REST APIs', 'Redis', 'Next.js']),
      experience: 3.5,
      location: 'Bengaluru, India',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Neha Verma',
      email: 'neha.verma@finwave.example.com',
      passwordHash: defaultPasswordHash,
      role: 'RECRUITER',
      title: 'Lead Talent Acquisition Partner',
      companyId: finwave.id,
      bio: 'Scaling core engineering teams at FinWave Technologies across Bengaluru & Hyderabad.',
      skills: JSON.stringify(['Technical Hiring', 'Talent Pipelines', 'Executive Recruitment']),
      experience: 6.0,
      location: 'Bengaluru, India',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'rajesh.admin@talentgrid.example.com',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      title: 'Platform Governance & Super Admin',
      bio: 'Platform compliance officer ensuring verified corporate KYC and robust RBAC governance.',
      skills: JSON.stringify(['Security Compliance', 'KYC Auditing', 'Platform Governance']),
      experience: 10.0,
      location: 'New Delhi, India',
    },
  });

  // 3. Seed Job Postings
  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Backend Systems Engineer',
      description: 'FinWave is building high-throughput payment settlement infrastructure for Tier-1 Indian banks. Join the core transaction ledger team handling 12,000 TPS with strict sub-50ms latency SLAs.',
      companyId: finwave.id,
      location: 'Bengaluru (Hybrid - HSR Layout)',
      ctcMin: 22.0,
      ctcMax: 28.0,
      requiredSkills: JSON.stringify(['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'Apache Kafka']),
      experienceYears: '3 - 6 Years',
      status: 'ACTIVE',
    },
  });

  await prisma.job.create({
    data: {
      title: 'Full Stack Platform Engineer',
      description: 'Zero-trust cloud infrastructure security. Bridging a responsive Next.js web console with high-scale telemetry microservices backend and audit pipelines.',
      companyId: kavach.id,
      location: 'Gurugram (Cyber City / Remote)',
      ctcMin: 18.0,
      ctcMax: 24.0,
      requiredSkills: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Docker']),
      experienceYears: '2 - 5 Years',
      status: 'ACTIVE',
    },
  });

  await prisma.job.create({
    data: {
      title: 'Lead Frontend Architect',
      description: 'High-performance 3D visualization and WebGL rendering engines for automotive design engineering teams.',
      companyId: nexus.id,
      location: 'Pune (Kharadi)',
      ctcMin: 30.0,
      ctcMax: 40.0,
      requiredSkills: JSON.stringify(['React', 'Three.js', 'WebGL', 'Shader Programming (GLSL)']),
      experienceYears: '5 - 8 Years',
      status: 'ACTIVE',
    },
  });

  // 4. Seed Existing Application (Rohan -> FinWave)
  await prisma.application.create({
    data: {
      jobId: job1.id,
      candidateId: rohan.id,
      status: 'APPLIED',
      matchScore: 92,
    },
  });

  // Seed another candidate for recruiter pipeline demo
  const ananya = await prisma.user.create({
    data: {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      passwordHash: defaultPasswordHash,
      role: 'CANDIDATE',
      title: 'Distributed Systems Engineer',
      bio: 'Ex-Swiggy backend developer. 4 years of experience building resilient microservices.',
      skills: JSON.stringify(['Java 21', 'Spring Boot 3', 'Apache Kafka', 'PostgreSQL']),
      experience: 4.0,
      location: 'Hyderabad, India',
    },
  });

  await prisma.application.create({
    data: {
      jobId: job1.id,
      candidateId: ananya.id,
      status: 'SHORTLISTED',
      matchScore: 84,
    },
  });

  // 5. Seed Initial Audit Logs
  await prisma.auditLog.create({
    data: {
      eventType: 'AUTH',
      message: 'Rohan Sharma authenticated session token created (BCrypt verified).',
      metadata: JSON.stringify({ userId: rohan.id, role: 'CANDIDATE' }),
    },
  });

  await prisma.auditLog.create({
    data: {
      eventType: 'APPLICATION',
      message: 'Application submitted: Rohan Sharma -> FinWave Technologies (Match Quotient: 92%).',
      metadata: JSON.stringify({ jobId: job1.id, candidateId: rohan.id, score: 92 }),
    },
  });

  console.log('✓ Seeding complete. 3 Personas, 3 Companies, 3 Jobs, and 2 Applications created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
