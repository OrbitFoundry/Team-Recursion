'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminRoute from '@/components/AdminRoute';
import AppLayout from '@/components/AppLayout';
import { adminApi, companiesApi } from '@/lib/placement-api';
import Button from '@/components/ui/Button';
import { CompanyIcon, TrashIcon, EditIcon } from '@/components/ui/Icons';
import { TechStackBadge } from '@/components/ui/TechStackSelector';
import { showToast } from '@/components/ToastProvider';
import type { Company, CompanyStatus } from '@/types/placement';

const STATUS_BADGE: Record<CompanyStatus, string> = {
  'Applied': 'bg-[#1f1d3d] text-white dark:bg-white dark:text-black',
  'Online Assessment': 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300',
  'Selected': 'bg-[#c8e6cd] text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300',
  'Rejected': 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300',
};

const ALL_STATUSES: CompanyStatus[] = [
  'Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected',
];

function AdminCompaniesContent() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  // Modals
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [newStatus, setNewStatus] = useState<CompanyStatus>('Applied');
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMasterCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getMasterCompanies({
        search: searchQuery,
        status: statusFilter,
      });
      setCompanies(data);
    } catch {
      setError('Failed to fetch master company register');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchMasterCompanies();
  }, [fetchMasterCompanies]);

  const handleUpdateStatus = async () => {
    if (!editCompany) return;
    try {
      setIsUpdating(true);
      await companiesApi.update(editCompany._id, { status: newStatus });
      showToast('Application status updated by administrator', 'success');
      setEditCompany(null);
      fetchMasterCompanies();
    } catch {
      showToast('Failed to update status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await companiesApi.delete(deleteId);
      showToast('Application entry removed from register', 'success');
      setDeleteId(null);
      fetchMasterCompanies();
    } catch {
      showToast('Failed to delete application', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#161522] p-6 md:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
              <CompanyIcon className="w-4 h-4 text-black dark:text-white" /> MASTER REGISTER
            </div>
            <h2 className="text-2xl font-bold tracking-tight dark:text-white font-sans">Institutional Application Log</h2>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
              View and moderate all student job applications and pipeline stages.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company or student..."
              className="px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all w-full sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            >
              <option value="">All Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 p-4 rounded-2xl text-xs font-mono border border-rose-200 dark:border-rose-900/50">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm overflow-hidden">
            {companies.length === 0 ? (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm font-mono">
                No application entries found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans">
                  <thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800/80 text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="py-4 px-6">COMPANY & ROLE</th>
                      <th className="py-4 px-6">STUDENT APPLICANT</th>
                      <th className="py-4 px-6">STAGE</th>
                      <th className="py-4 px-6">TECH STACKS</th>
                      <th className="py-4 px-6">APPLIED DATE</th>
                      <th className="py-4 px-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                    {companies.map((c) => {
                      const studentObj = (c as any).student;
                      return (
                        <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-900 dark:text-white">{c.companyName}</div>
                            <div className="text-xs font-mono text-gray-500 dark:text-gray-400">{c.role}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900 dark:text-white">{studentObj?.name || 'Student'}</div>
                            <div className="text-xs font-mono text-gray-500 dark:text-gray-400">{studentObj?.email || ''}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`text-[10px] font-mono uppercase font-bold px-3 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[c.status]}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {c.techStacks && c.techStacks.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 max-w-xs">
                                {c.techStacks.map((ts) => (
                                  <TechStackBadge key={ts} stack={ts} />
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs font-mono text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-xs font-mono text-gray-500">
                            {new Date(c.applicationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditCompany(c);
                                  setNewStatus(c.status);
                                }}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                                title="Update Status"
                              >
                                <EditIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteId(c._id)}
                                className="p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors"
                                title="Delete Entry"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Edit Status Modal */}
        {editCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 max-w-md w-full shadow-2xl space-y-5 font-sans">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="text-lg font-bold tracking-tight dark:text-white">UPDATE APPLICATION STAGE</h3>
                <button onClick={() => setEditCompany(null)} className="text-gray-400 hover:text-black dark:hover:text-white font-bold">✕</button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs font-mono">
                <p><strong>Company:</strong> {editCompany.companyName}</p>
                <p><strong>Role:</strong> {editCompany.role}</p>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  PIPELINE STAGE
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as CompanyStatus)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="primary" className="flex-1 py-3" onClick={handleUpdateStatus} isLoading={isUpdating}>
                  SAVE STAGE
                </Button>
                <Button variant="secondary" className="py-3" onClick={() => setEditCompany(null)}>
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 max-w-md w-full shadow-2xl space-y-5 font-sans">
              <h3 className="text-lg font-bold tracking-tight text-rose-600 dark:text-rose-400">PURGE APPLICATION RECORD</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-sans">
                Are you sure you want to delete this application record? This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-2">
                <Button variant="danger" className="flex-1 py-3" onClick={handleDelete} isLoading={isDeleting}>
                  CONFIRM DELETE
                </Button>
                <Button variant="secondary" className="py-3" onClick={() => setDeleteId(null)}>
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function AdminCompaniesPage() {
  return (
    <AdminRoute>
      <AdminCompaniesContent />
    </AdminRoute>
  );
}
