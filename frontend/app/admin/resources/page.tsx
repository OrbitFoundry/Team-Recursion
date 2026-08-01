'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { adminApi } from '@/lib/placement-api';
import { ResourceIcon, ExternalLinkIcon } from '@/components/ui/Icons';
import type { AdminResource, ResourceCategory } from '@/types/placement';

const CATEGORY_COLORS: Record<ResourceCategory, string> = {
  'DSA': 'bg-[#1f1d3d] text-white dark:bg-white dark:text-black',
  'Aptitude': 'bg-[#f4ecd6] text-black',
  'Resume': 'bg-[#c8e6cd] text-black',
  'Interview Experience': 'bg-[#c5b0f4] text-black',
  'Core Subjects': 'bg-[#dceeb1] text-black',
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
      .catch(() => setError('Failed to load shared resources'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this resource entry permanently from the repository?')) return;
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 font-sans">
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">Resource Moderation Repository</h2>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">Audit, moderate, and remove student-contributed preparation resources</p>
        </div>
      </div>

      {/* Toolbar Search */}
      <div className="mb-6">
        <input
          className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161522] text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all placeholder-gray-400 font-sans"
          placeholder="Search by title, student name, or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 p-4 rounded-2xl text-xs font-mono mb-6 border border-rose-200 dark:border-rose-900/50">
          {error}
        </div>
      )}

      {/* Resources Moderation Table */}
      <div className="bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm overflow-hidden font-sans">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-mono">
            <div className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500">
              <ResourceIcon className="w-full h-full" />
            </div>
            <div className="text-sm font-semibold">NO RESOURCES MATCHED</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/40 text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4 font-semibold">RESOURCE TITLE</th>
                  <th className="px-6 py-4 font-semibold">CATEGORY</th>
                  <th className="px-6 py-4 font-semibold">SUBMITTED BY</th>
                  <th className="px-6 py-4 font-semibold">LINK</th>
                  <th className="px-6 py-4 font-semibold">DATE</th>
                  <th className="px-6 py-4 text-right">MODERATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm">
                {filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white max-w-xs truncate">{r.title}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-mono uppercase font-semibold px-3 py-1 rounded-full whitespace-nowrap ${CATEGORY_COLORS[r.category]}`}>
                        {r.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white text-xs">{r.student.name}</div>
                      <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400">{r.student.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs font-mono font-semibold text-black dark:text-white hover:underline max-w-xs truncate"
                      >
                        <ExternalLinkIcon className="w-3.5 h-3.5 inline mr-1 shrink-0" />
                        <span className="truncate">{r.link.replace(/^https?:\/\//, '')}</span>
                      </a>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={deleting === r._id}
                        className="px-3.5 py-1.5 text-xs font-mono font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white rounded-full transition-all disabled:opacity-50"
                      >
                        {deleting === r._id ? '…' : 'REMOVE'}
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
        <div className="mt-4 text-xs font-mono text-gray-500 dark:text-gray-400 text-right">
          TOTAL RESOURCES: {filtered.length}
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
