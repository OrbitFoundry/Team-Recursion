'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { companiesApi } from '@/lib/placement-api';
import { PlusIcon, CompanyIcon } from '@/components/ui/Icons';
import { TechStackSelector } from '@/components/ui/TechStackSelector';
import { useAuth } from '@/contexts/AuthContext';
import type { Company, CompanyStatus } from '@/types/placement';

const STATUSES: CompanyStatus[] = [
  'Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected',
];

const STATUS_BADGE: Record<CompanyStatus, string> = {
  'Applied': 'bg-[#1f1d3d] text-white dark:bg-white dark:text-black',
  'Online Assessment': 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300',
  'Selected': 'bg-[#c8e6cd] text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300',
  'Rejected': 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300',
};

function CompanyModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Company>;
  onSave: (data: Partial<Company>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    companyName: initial?.companyName || '',
    role: initial?.role || '',
    applicationDate: initial?.applicationDate
      ? new Date(initial.applicationDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    status: (initial?.status || 'Applied') as CompanyStatus,
    companyLink: initial?.companyLink || '',
    techStacks: initial?.techStacks || [],
    notes: initial?.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch {
      setError('Failed to save application. Please verify parameters.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
      <div className="bg-white dark:bg-[#161522] rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200/80 dark:border-gray-800/80 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/40">
          <div className="text-[11px] font-mono uppercase tracking-widest text-gray-500 mb-1">
            {initial?._id ? 'UPDATE APPLICATION' : 'NEW ENTRY'}
          </div>
          <h2 className="text-xl font-bold tracking-tight dark:text-white">
            {initial?._id ? 'Edit Application' : 'Add Application'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-mono p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/50">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                COMPANY NAME *
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
                placeholder="Google, Microsoft, Amazon…"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                JOB ROLE *
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
                placeholder="SDE-1, Software Engineer…"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                APPLICATION DATE
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                value={form.applicationDate}
                onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                CURRENT STATUS
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as CompanyStatus })}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              COMPANY LINK (OPTIONAL)
            </label>
            <input
              type="url"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
              value={form.companyLink}
              onChange={(e) => setForm({ ...form, companyLink: e.target.value })}
              placeholder="https://careers.google.com/..."
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              REQUIRED TECH STACKS
            </label>
            <TechStackSelector
              selectedStacks={form.techStacks}
              onChange={(stacks) => setForm({ ...form, techStacks: stacks })}
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              NOTES & PREP RECAP
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Referral source, key round prep notes, compensation details…"
            />
          </div>
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-sm"
            >
              {saving ? 'SAVING…' : 'SAVE ENTRY'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CompaniesContent() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [modal, setModal] = useState<{ open: boolean; company?: Company }>({ open: false });
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await companiesApi.getAll({ search, status: filterStatus, sort });
      setCompanies(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, filterStatus, sort]);

  const handleSave = async (data: Partial<Company>) => {
    if (modal.company?._id) {
      await companiesApi.update(modal.company._id, data);
    } else {
      await companiesApi.create(data as Parameters<typeof companiesApi.create>[0]);
    }
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application entry?')) return;
    setDeleting(id);
    try {
      await companiesApi.delete(id);
      setCompanies(prev => prev.filter(c => c._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AppLayout>
      {modal.open && (
        <CompanyModal
          initial={modal.company}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">Applications Tracker</h2>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">Manage and track your active job application pipelines</p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          <PlusIcon className="w-4 h-4" /> ADD APPLICATION
        </button>
      </div>

      {/* Toolbar Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <input
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161522] text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all placeholder-gray-400"
          placeholder="Search by company or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161522] text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Application Stages</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161522] text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Sort: Newest First</option>
          <option value="asc">Sort: Oldest First</option>
        </select>
      </div>

      {/* Cards Container */}
      <div className="w-full">
        {loading ? (
          <div className="flex justify-center items-center h-48 bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500">
              <CompanyIcon className="w-full h-full" />
            </div>
            <div className="text-sm font-semibold font-mono text-gray-500 dark:text-gray-400">NO APPLICATIONS RECORDED</div>
            <div className="text-xs text-gray-400 mt-1 font-mono">Click &quot;Add Application&quot; to begin tracking</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c) => (
              <div
                key={c._id}
                className="group relative flex flex-col bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:shadow-lg transition-all overflow-hidden p-6"
              >
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-[10px] font-mono uppercase font-semibold px-2.5 py-1 rounded-md whitespace-nowrap ${STATUS_BADGE[c.status]}`}>
                    {c.status}
                  </span>
                  
                  {c.companyLink && (
                    <a
                      href={c.companyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                      title="Visit Company Link"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>

                <div className="mb-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate" title={c.companyName}>
                    {c.companyName}
                  </h3>
                </div>
                
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 truncate" title={c.role}>
                  {c.role}
                </div>
                
                {/* Tech Stacks & Match % */}
                <div className="mb-4">
                  {c.techStacks && c.techStacks.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {c.techStacks.map(stack => (
                          <span key={stack} className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {stack}
                          </span>
                        ))}
                      </div>
                      {(() => {
                        const userStacks = user?.techStacks || [];
                        const matchingStacks = c.techStacks.filter(t => userStacks.includes(t));
                        const matchPercentage = Math.round((matchingStacks.length / c.techStacks.length) * 100);
                        const isHighMatch = matchPercentage >= 75;
                        const isMediumMatch = matchPercentage >= 40 && matchPercentage < 75;
                        
                        let colorClass = 'text-rose-600 dark:text-rose-400';
                        if (isHighMatch) colorClass = 'text-emerald-600 dark:text-emerald-400';
                        else if (isMediumMatch) colorClass = 'text-amber-600 dark:text-amber-400';

                        return (
                          <div 
                            className={`text-xs font-bold font-mono ${colorClass} inline-flex items-center gap-1 cursor-help`}
                            title={`You match ${matchingStacks.length} out of ${c.techStacks.length} required tech stacks: ${matchingStacks.join(', ') || 'None'}`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {matchPercentage}% MATCH
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 font-mono italic">
                      NO TECH STACKS SPECIFIED
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(c.applicationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>

                {c.notes && (
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/80">
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2" title={c.notes}>
                      {c.notes}
                    </p>
                  </div>
                )}
                
                {!c.notes && <div className="mt-auto" />}

                {/* Actions overlay on hover */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setModal({ open: true, company: c })}
                    className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full shadow-sm transition-all"
                    title="Edit Application"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    disabled={deleting === c._id}
                    className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white rounded-full shadow-sm transition-all disabled:opacity-50"
                    title="Delete Application"
                  >
                    {deleting === c._id ? (
                      <span className="flex items-center justify-center w-4 h-4 font-mono text-[10px]">…</span>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary count */}
      {companies.length > 0 && (
        <div className="mt-4 text-xs font-mono text-gray-500 dark:text-gray-400 text-right">
          TOTAL APPLICATIONS: {companies.length}
        </div>
      )}
    </AppLayout>
  );
}

export default function CompaniesPage() {
  return (
    <ProtectedRoute>
      <CompaniesContent />
    </ProtectedRoute>
  );
}
