'use client';

import { useEffect, useState, useCallback } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { adminApi } from '@/lib/placement-api';
import type { AdminCompany, CompanyStatus } from '@/types/placement';

const STATUSES: CompanyStatus[] = [
  'Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected',
];

const STATUS_BADGE: Record<CompanyStatus, string> = {
  'Applied': 'bg-[#1f1d3d] text-white dark:bg-white dark:text-black',
  'Online Assessment': 'bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-950 dark:bg-blue-950/60 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-950 dark:bg-purple-950/60 dark:text-purple-300',
  'Selected': 'bg-[#c8e6cd] text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300',
  'Rejected': 'bg-rose-100 text-rose-950 dark:bg-rose-950/60 dark:text-rose-300',
};

function EditStatusModal({
  company,
  onSave,
  onClose,
}: {
  company: AdminCompany;
  onSave: (id: string, status: CompanyStatus) => Promise<void>;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<CompanyStatus>(company.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(company._id, status);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
      <div className="bg-white dark:bg-[#161522] rounded-3xl shadow-2xl w-full max-w-sm border border-gray-200/80 dark:border-gray-800/80 overflow-hidden font-sans">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/40">
          <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">OVERRIDE APPLICATION STAGE</div>
          <h2 className="text-lg font-bold tracking-tight dark:text-white truncate">
            {company.companyName}
          </h2>
          <div className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
            {company.student?.name || 'Unknown Student'} ({company.student?.email || 'N/A'})
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              NEW PIPELINE STATUS
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans"
              value={status}
              onChange={(e) => setStatus(e.target.value as CompanyStatus)}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-sm"
            >
              {saving ? 'SAVING…' : 'UPDATE STAGE'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminCompaniesContent() {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [editModal, setEditModal] = useState<AdminCompany | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllCompanies({
        search,
        status: filterStatus,
        sort,
        studentSearch,
      });
      setCompanies(data);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, sort, studentSearch]);

  useEffect(() => { load(); }, [load]);

  const handleUpdateStatus = async (id: string, status: CompanyStatus) => {
    await adminApi.updateCompany(id, { status });
    setCompanies(prev => prev.map(c => c._id === id ? { ...c, status } : c));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application entry from the master records?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteCompany(id);
      setCompanies(prev => prev.filter(c => c._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AppLayout>
      {editModal && (
        <EditStatusModal
          company={editModal}
          onSave={handleUpdateStatus}
          onClose={() => setEditModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 font-sans">
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">Master Applications Register</h2>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">Audit and moderate all student job applications across all companies</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 font-sans">
        <input
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161522] text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all placeholder-gray-400"
          placeholder="Filter by company name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161522] text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all placeholder-gray-400"
          placeholder="Filter by student name/email…"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
        />
        <select
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161522] text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Pipeline Stages</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161522] text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Sort: Newest First</option>
          <option value="asc">Sort: Oldest First</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm overflow-hidden font-sans">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-mono">
            <div className="text-5xl mb-3">🏢</div>
            <div className="text-sm font-semibold">NO APPLICATIONS MATCHED</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/40 text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4 font-semibold">STUDENT</th>
                  <th className="px-6 py-4 font-semibold">COMPANY</th>
                  <th className="px-6 py-4 font-semibold">ROLE</th>
                  <th className="px-6 py-4 font-semibold">DATE</th>
                  <th className="px-6 py-4 font-semibold">STAGE</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm">
                {companies.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">{c.student?.name || 'Unknown Student'}</div>
                      <div className="text-xs font-mono text-gray-500 dark:text-gray-400">{c.student?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{c.companyName}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{c.role}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {new Date(c.applicationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-mono uppercase font-semibold px-3 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditModal(c)}
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

      {companies.length > 0 && (
        <div className="mt-4 text-xs font-mono text-gray-500 dark:text-gray-400 text-right">
          MASTER COUNT: {companies.length}
        </div>
      )}
    </AppLayout>
  );
}

export default function AdminCompaniesPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminCompaniesContent />
    </ProtectedRoute>
  );
}
