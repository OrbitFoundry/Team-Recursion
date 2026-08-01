'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { resourcesApi } from '@/lib/placement-api';
import type { Resource, ResourceCategory } from '@/types/placement';

const CATEGORIES: ResourceCategory[] = [
  'DSA', 'Aptitude', 'Resume', 'Interview Experience', 'Core Subjects',
];

const CATEGORY_COLORS: Record<ResourceCategory, string> = {
  'DSA': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Aptitude': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Resume': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Interview Experience': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Core Subjects': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
};

function AddResourceModal({
  onSave,
  onClose,
}: {
  onSave: (data: { title: string; category: ResourceCategory; link: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ title: '', category: 'DSA' as ResourceCategory, link: '' });
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
      setError('Failed to save. Check the URL and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold dark:text-white">Add Resource</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Title *</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Striver A-Z DSA Sheet…"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Category *</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ResourceCategory })}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">Link *</label>
            <input
              type="url"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              required
              placeholder="https://…"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
            >
              {saving ? 'Saving…' : 'Add Resource'}
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

function ResourcesContent() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await resourcesApi.getAll({ category: filterCategory || undefined });
      setResources(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterCategory]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    setDeleting(id);
    try {
      await resourcesApi.delete(id);
      setResources(prev => prev.filter(r => r._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const handleAdd = async (data: { title: string; category: ResourceCategory; link: string }) => {
    await resourcesApi.create(data);
    await load();
  };

  return (
    <AppLayout>
      {showModal && (
        <AddResourceModal onSave={handleAdd} onClose={() => setShowModal(false)} />
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          className="flex-1 sm:flex-none sm:w-52 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap ml-auto"
        >
          ＋ Add Resource
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <div className="text-4xl mb-3">📚</div>
          <div className="text-sm">No resources found. Add your first one!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {resources.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[r.category]}`}>
                  {r.category}
                </span>
                <button
                  onClick={() => handleDelete(r._id)}
                  disabled={deleting === r._id}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 dark:hover:text-red-400 transition-all text-xs px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  {deleting === r._id ? '…' : 'Delete'}
                </button>
              </div>
              <h3 className="font-medium text-sm dark:text-white mb-2 line-clamp-2">{r.title}</h3>
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline truncate block"
              >
                {r.link}
              </a>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Added {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

export default function ResourcesPage() {
  return (
    <ProtectedRoute>
      <ResourcesContent />
    </ProtectedRoute>
  );
}
