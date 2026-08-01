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
  'DSA': 'bg-[#1f1d3d] text-white dark:bg-white dark:text-black',
  'Aptitude': 'bg-[#f4ecd6] text-black',
  'Resume': 'bg-[#c8e6cd] text-black',
  'Interview Experience': 'bg-[#c5b0f4] text-black',
  'Core Subjects': 'bg-[#dceeb1] text-black',
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

    let formattedLink = form.link.trim();
    if (!formattedLink) {
      setError('Please provide a valid document or website link.');
      setSaving(false);
      return;
    }
    if (!/^https?:\/\//i.test(formattedLink)) {
      formattedLink = 'https://' + formattedLink;
    }

    try {
      await onSave({ ...form, link: formattedLink });
      onClose();
    } catch {
      setError('Failed to save resource. Please check the URL structure.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
      <div className="bg-white dark:bg-[#161522] rounded-3xl shadow-2xl w-full max-w-md border border-gray-200/80 dark:border-gray-800/80 overflow-hidden font-sans">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/40">
          <div className="text-[11px] font-mono uppercase tracking-widest text-gray-500 mb-1">REPOSITORIES</div>
          <h2 className="text-xl font-bold tracking-tight dark:text-white">Add Prep Resource</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-mono p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/50">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              RESOURCE TITLE *
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Striver A-Z DSA Sheet, NeetCode 150…"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              CATEGORY *
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-sans"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ResourceCategory })}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              URL / DOCUMENT LINK *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-mono text-xs"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              required
              placeholder="takeuforward.org/strivers-a2z-dsa-course"
            />
          </div>
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-sm"
            >
              {saving ? 'SAVING…' : 'ADD RESOURCE'}
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
    if (!confirm('Delete this resource entry?')) return;
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

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">Placement Resource Hub</h2>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">Curated links for DSA, core CS fundamentals, and interview prep</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          <span>＋</span> ADD RESOURCE
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setFilterCategory('')}
          className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
            filterCategory === ''
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
              : 'bg-white dark:bg-[#161522] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          ALL CATEGORIES
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
              filterCategory === c
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-white dark:bg-[#161522] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-mono">
          <div className="text-5xl mb-3">📚</div>
          <div className="text-sm font-semibold">NO PREP RESOURCES FOUND</div>
          <div className="text-xs text-gray-400 mt-1">Be the first to share a resource link</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {resources.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm p-6 hover-lift flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${CATEGORY_COLORS[r.category]}`}>
                    {r.category}
                  </span>
                  <button
                    onClick={() => handleDelete(r._id)}
                    disabled={deleting === r._id}
                    className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 font-mono text-[11px] font-bold uppercase transition-all"
                  >
                    {deleting === r._id ? '…' : 'DELETE'}
                  </button>
                </div>
                <h3 className="font-bold text-base dark:text-white mb-2 line-clamp-2 leading-snug">{r.title}</h3>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/60">
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-black dark:text-white hover:underline truncate max-w-full"
                >
                  <span>🔗</span>
                  <span className="truncate">{r.link.replace(/^https?:\/\//, '')}</span>
                </a>
                <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mt-2">
                  ADDED {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                </div>
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
