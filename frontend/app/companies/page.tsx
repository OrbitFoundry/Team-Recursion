'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { companiesApi } from '@/lib/placement-api';
import type { Company, CompanyStatus } from '@/types/placement';

const STATUSES: CompanyStatus[] = [
  'Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected',
];

const STATUS_BADGE: Record<CompanyStatus, string> = {
  'Applied': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Online Assessment': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Selected': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
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
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold dark:text-white">
            {initial?._id ? 'Edit Application' : 'Add Application'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Company Name *</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
                placeholder="Google, Amazon…"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Job Role *</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
                placeholder="SDE-1, Backend Developer…"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Application Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.applicationDate}
                onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Status</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as CompanyStatus })}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Notes (optional)</label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Applied via LinkedIn, referral, etc."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
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
    if (!confirm('Delete this application?')) return;
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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search companies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <button
          onClick={() => setModal({ open: true })}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
        >
          ＋ Add Application
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <div className="text-4xl mb-3">📋</div>
            <div className="text-sm">No applications found. Start tracking!</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Company</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Notes</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium dark:text-white">{c.companyName}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{c.role}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                      {new Date(c.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-500 max-w-xs truncate">
                      {c.notes || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setModal({ open: true, company: c })}
                          className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          disabled={deleting === c._id}
                          className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === c._id ? '…' : 'Delete'}
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

      {/* Summary */}
      {companies.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Showing {companies.length} application{companies.length !== 1 ? 's' : ''}
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
