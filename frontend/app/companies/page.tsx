'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { companiesApi } from '@/lib/placement-api';
import { PlusIcon, CompanyIcon } from '@/components/ui/Icons';
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

      {/* Table Container */}
      <div className="bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-mono">
            <div className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500">
              <CompanyIcon className="w-full h-full" />
            </div>
            <div className="text-sm font-semibold">NO APPLICATIONS RECORDED</div>
            <div className="text-xs text-gray-400 mt-1">Click &quot;Add Application&quot; to begin tracking</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/40 text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4 font-semibold">COMPANY</th>
                  <th className="px-6 py-4 font-semibold">ROLE</th>
                  <th className="px-6 py-4 font-semibold">DATE</th>
                  <th className="px-6 py-4 font-semibold">STAGE</th>
                  <th className="px-6 py-4 font-semibold">NOTES</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm">
                {companies.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{c.companyName}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{c.role}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {new Date(c.applicationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-mono uppercase font-semibold px-3 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {c.notes || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setModal({ open: true, company: c })}
                          className="px-3.5 py-1.5 text-xs font-mono font-medium bg-gray-100 dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full transition-all"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          disabled={deleting === c._id}
                          className="px-3.5 py-1.5 text-xs font-mono font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white rounded-full transition-all disabled:opacity-50"
                        >
                          {deleting === c._id ? '…' : 'DELETE'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
