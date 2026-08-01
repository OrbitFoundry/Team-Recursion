'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { adminApi } from '@/lib/placement-api';
import type { AdminResource, ResourceCategory } from '@/types/placement';

const CATEGORY_COLORS: Record<ResourceCategory, string> = {
  'DSA': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Aptitude': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Resume': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Interview Experience': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Core Subjects': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
};

function AdminResourcesContent() {
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.getAllResources()
      .then(setResources)
      .catch(() => setError('Failed to load resources'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this resource?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteResource(id);
      setResources(prev => prev.filter(r => r._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const filtered = resources.filter(
    r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.student.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search by title, student, or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <div className="text-4xl mb-3">📚</div>
            <div className="text-sm">No resources found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Link</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Added</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-3 font-medium dark:text-white max-w-xs truncate">{r.title}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[r.category]}`}>
                        {r.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-xs font-medium dark:text-white">{r.student.name}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{r.student.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline max-w-xs truncate block"
                      >
                        {r.link}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={deleting === r._id}
                        className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleting === r._id ? '…' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
        </div>
      )}
    </AppLayout>
  );
}

export default function AdminResourcesPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminResourcesContent />
    </ProtectedRoute>
  );
}
