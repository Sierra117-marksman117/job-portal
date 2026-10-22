'use client';

import React, { useState } from 'react';
import { updateCompanyKyc } from '@/app/actions';
import { useToast } from './Toast';

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

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#f8fafc]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Platform Administration & Compliance
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Recruiter KYC Verification, RBAC Roles & System Security Audit Trail
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold self-start sm:self-auto">
          Role: Super Admin (Rajesh Kumar)
        </span>
      </div>

      {/* Quick Platform Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Registered Users</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 mono">{stats.userCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Candidates & Recruiters</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Active Requisitions</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 mono">{stats.jobCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Live on portal</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Applications Handled</span>
          <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 mono">{stats.applicationCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">With skill fit scores</span>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        
        {/* Recruiter KYC Approvals Queue (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              Pending Recruiter KYC Approvals ({pendingKyc.length})
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
                        className="btn-press px-3.5 py-1.5 min-h-[36px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleKycToggle(company.id, company.name, false)}
                        className="btn-press px-3.5 py-1.5 min-h-[36px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleKycToggle(company.id, company.name, false)}
                      className="btn-press px-3.5 py-1.5 min-h-[36px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium"
                    >
                      Revoke Verification
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Security Trail (1 Col) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
            System Security Audit Trail
          </h3>
          <div className="space-y-2.5 text-[11px] text-slate-600 mono custom-scroll max-h-[380px] overflow-y-auto pr-1">
            {initialAuditLogs.map((log) => (
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
