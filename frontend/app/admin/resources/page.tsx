'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminRoute from '@/components/AdminRoute';
import AppLayout from '@/components/AppLayout';
import { resourcesApi } from '@/lib/placement-api';
import Button from '@/components/ui/Button';
import { ResourceIcon, TrashIcon, ExternalLinkIcon } from '@/components/ui/Icons';
import { showToast } from '@/components/ToastProvider';
import type { Resource, ResourceCategory } from '@/types/placement';

const CATEGORIES: { label: string; value: ResourceCategory | 'ALL' }[] = [
  { label: 'All Categories', value: 'ALL' },
  { label: 'DSA', value: 'DSA' },
  { label: 'Aptitude', value: 'Aptitude' },
  { label: 'Resume', value: 'Resume' },
  { label: 'Interview Experience', value: 'Interview Experience' },
  { label: 'Core Subjects', value: 'Core Subjects' },
];

function AdminResourcesContent() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'ALL'>('ALL');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const data = await resourcesApi.getAll({
        category: activeCategory === 'ALL' ? undefined : activeCategory,
      });
      setResources(data);
    } catch {
      setError('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await resourcesApi.delete(deleteId);
      showToast('Resource removed by administrator', 'success');
      setDeleteId(null);
      fetchResources();
    } catch {
      showToast('Failed to remove resource', 'error');
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
              <ResourceIcon className="w-4 h-4 text-black dark:text-white" /> MODERATION HUB
            </div>
            <h2 className="text-2xl font-bold tracking-tight dark:text-white font-sans">Resource Moderation</h2>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
              Audit, test, and moderate student-shared study materials and prep guides.
            </p>
          </div>
        </div>

        {/* Categories pill tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat.value
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400 dark:text-gray-500 text-sm font-mono bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80">
                No resources in this category.
              </div>
            ) : (
              resources.map((r) => (
                <div
                  key={r._id}
                  className="bg-white dark:bg-[#161522] p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 bg-[#f4ecd6] dark:bg-gray-800 text-black dark:text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
                        {r.category}
                      </span>
                      <button
                        onClick={() => setDeleteId(r._id)}
                        className="p-1.5 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remove Resource"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mb-2 font-sans">
                      {r.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white hover:underline"
                    >
                      OPEN LINK <ExternalLinkIcon className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Delete Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 max-w-md w-full shadow-2xl space-y-5 font-sans">
              <h3 className="text-lg font-bold tracking-tight text-rose-600 dark:text-rose-400">REMOVE RESOURCE</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to remove this resource from the public hub?
              </p>
              <div className="flex gap-3 pt-2">
                <Button variant="danger" className="flex-1 py-3" onClick={handleDelete} isLoading={isDeleting}>
                  CONFIRM REMOVE
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

export default function AdminResourcesPage() {
  return (
    <AdminRoute>
      <AdminResourcesContent />
    </AdminRoute>
  );
}
