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
  'Applied': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Online Assessment': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Selected': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-base font-semibold mb-4 dark:text-white">
          Edit Status — {company.companyName}
        </h2>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{company.student.name}</div>
        <select
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value as CompanyStatus)}
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>
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
    if (!confirm('Delete this application?')) return;
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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
        <input
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search companies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Filter by student name/email…"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
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
            <div className="text-sm">No applications found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Company</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-xs dark:text-white">{c.student.name}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{c.student.email}</div>
                    </td>
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
                    <td className="px-5 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditModal(c)}
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

      {companies.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {companies.length} application{companies.length !== 1 ? 's' : ''}
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
