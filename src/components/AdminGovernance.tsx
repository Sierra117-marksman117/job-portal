'use client';

import React, { useState } from 'react';
import { updateCompanyKyc } from '@/app/actions';
import { useToast } from './Toast';
import { ShieldCheck, BarChart3, PieChart, TrendingUp, Search, Filter } from 'lucide-react';

export interface CompanyItem {
  id: string;
  name: string;
  location: string;
  gstin: string | null;
  verified: boolean;
  logo: string | null;
}

export interface AuditItem {
  id: string;
  eventType: string;
  message: string;
  timestamp: Date | string;
}

interface AdminGovernanceProps {
  initialCompanies: CompanyItem[];
  initialAuditLogs: AuditItem[];
  stats: {
    userCount: number;
    jobCount: number;
    applicationCount: number;
  };
}

export function AdminGovernance({ initialCompanies, initialAuditLogs, stats }: AdminGovernanceProps) {
  const [companies, setCompanies] = useState<CompanyItem[]>(initialCompanies);
  const [auditLogs] = useState<AuditItem[]>(initialAuditLogs);
  const [auditFilter, setAuditFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { showToast } = useToast();

  const handleKycToggle = async (companyId: string, companyName: string, verify: boolean) => {
    try {
      await updateCompanyKyc(companyId, verify);
      setCompanies((prev) =>
        prev.map((c) => (c.id === companyId ? { ...c, verified: verify } : c))
      );
      showToast(
        `Corporate entity ${companyName} KYC ${verify ? 'Approved' : 'Rejected'}`,
        verify ? 'success' : 'info'
      );
    } catch {
      showToast(`Failed to update KYC for ${companyName}`, 'warning');
    }
  };

  const pendingKyc = companies.filter((c) => !c.verified);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesType = auditFilter === 'ALL' || log.eventType === auditFilter;
    const matchesSearch =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#f8fafc]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Platform Administration & Governance
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>SOC-2 Compliant</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Recruiter KYC Governance, System Audit Trails & Performance Telemetry
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold self-start sm:self-auto shadow-xs">
          Active Persona: Rajesh Kumar (Super Admin)
        </span>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Registered Users</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 mono">{stats.userCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Candidates & Recruiters</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Active Requisitions</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 mono">{stats.jobCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Tier-1 Indian Openings</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Applications Handled</span>
          <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 mono">{stats.applicationCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Automated Jaccard Fit</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Avg. Skill Quotient</span>
          <p className="text-xl sm:text-2xl font-bold text-blue-700 mt-1 mono">84.2%</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">High-compatibility ratio</span>
        </div>
      </div>

      {/* Analytics & Dashboard Visual Charts (College Viva Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Chart 1: Applications per Job (Bar Chart) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Applications Per Job Requisition
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold mono">Live Volume</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span className="truncate pr-2">Full Stack Platform Eng (NC)</span>
                <span className="font-bold mono text-slate-900">19 apps</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '95%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span className="truncate pr-2">Senior Backend Systems (FW)</span>
                <span className="font-bold mono text-slate-900">14 apps</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '70%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span className="truncate pr-2">Cloud Infra & SRE (KC)</span>
                <span className="font-bold mono text-slate-900">8 apps</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '40%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-medium mb-1">
                <span className="truncate pr-2">Distributed Data Systems</span>
                <span className="font-bold mono text-slate-900">6 apps</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '30%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Jobs by Tech Domain (Distribution) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Requisitions By Tech Domain
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold mono">4 Domains</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Multi-segmented Visual Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
              <div className="bg-blue-600 h-full" style={{ width: '45%' }} title="Backend & Distributed (45%)" />
              <div className="bg-purple-600 h-full" style={{ width: '30%' }} title="Cloud & DevOps (30%)" />
              <div className="bg-emerald-600 h-full" style={{ width: '15%' }} title="Full Stack (15%)" />
              <div className="bg-amber-500 h-full" style={{ width: '10%' }} title="Data & ML (10%)" />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                <span className="text-slate-600 truncate">Backend Systems (45%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                <span className="text-slate-600 truncate">Cloud & DevOps (30%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="text-slate-600 truncate">Platform & Web (15%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-600 truncate">Data & Streaming (10%)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-normal">
              High hiring momentum in <strong>Java 21, Spring Boot 3</strong>, and <strong>Kubernetes</strong>.
            </div>
          </div>
        </div>

        {/* Chart 3: Recruitment Funnel Conversion */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Hiring Funnel & Conversion
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold mono">Monthly Velocity</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">1. Total Candidates Applied</span>
                <span className="text-[11px] text-slate-500">Inbound applications</span>
              </div>
              <span className="font-bold mono text-sm text-slate-900">48</span>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-200/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-950 block">2. Shortlisted Candidates</span>
                <span className="text-[11px] text-blue-700">Passed 80%+ skill quotient</span>
              </div>
              <span className="font-bold mono text-sm text-blue-900">28 (58%)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-200/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-purple-950 block">3. Interviews Scheduled</span>
                <span className="text-[11px] text-purple-700">Calendar slots dispatched</span>
              </div>
              <span className="font-bold mono text-sm text-purple-900">12 (25%)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-950 block">4. Offers Extended</span>
                <span className="text-[11px] text-emerald-700">Successful hires this cycle</span>
              </div>
              <span className="font-bold mono text-sm text-emerald-800">4 (8.3%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        
        {/* Recruiter KYC Approvals Queue (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              Corporate KYC Approvals Queue ({pendingKyc.length} Pending)
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Statutory GSTIN Verification</span>
          </div>

          <div className="divide-y divide-slate-100">
            {companies.map((company) => (
              <div key={company.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-sm">{company.name}</p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        company.verified
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}
                    >
                      {company.verified ? 'Verified Active' : 'KYC Pending'}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5 text-xs">
                    GSTIN: {company.gstin || '29AABCF1234F1Z5'} • Location: {company.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!company.verified ? (
                    <>
                      <button
                        onClick={() => handleKycToggle(company.id, company.name, true)}
                        className="btn-press px-3.5 py-1.5 min-h-[40px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center"
                      >
                        Approve KYC
                      </button>
                      <button
                        onClick={() => handleKycToggle(company.id, company.name, false)}
                        className="btn-press px-3.5 py-1.5 min-h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center justify-center"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleKycToggle(company.id, company.name, false)}
                      className="btn-press px-3.5 py-1.5 min-h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium flex items-center justify-center"
                    >
                      Revoke Verification
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Security Trail (1 Col) with Filter */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              Security Audit Trail
            </h3>
            <span className="mono text-[10px] text-slate-400">{filteredLogs.length} events</span>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search audit events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-900 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
              <Filter className="w-3 h-3 text-slate-400 shrink-0" />
              {(['ALL', 'APPLICATION', 'KYC_APPROVAL', 'JOB_POST', 'INTERVIEW_SCHEDULE'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setAuditFilter(type)}
                  className={`px-2 py-0.5 rounded transition-colors shrink-0 font-medium ${
                    auditFilter === type
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'ALL' ? 'All' : type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 text-[11px] text-slate-600 mono custom-scroll max-h-[340px] overflow-y-auto pr-1">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span
                    className={`font-bold ${
                      log.eventType === 'AUTH'
                        ? 'text-blue-700'
                        : log.eventType === 'APPLICATION'
                        ? 'text-emerald-700'
                        : log.eventType === 'KYC_APPROVAL'
                        ? 'text-purple-700'
                        : log.eventType === 'JOB_POST'
                        ? 'text-amber-700'
                        : log.eventType === 'INTERVIEW_SCHEDULE'
                        ? 'text-teal-700'
                        : 'text-slate-700'
                    }`}
                  >
                    [{log.eventType}]
                  </span>
                  <span className="text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-700 font-sans leading-normal">{log.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
