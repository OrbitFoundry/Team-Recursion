import { useState, useEffect } from 'react';
import { timelineApi } from '@/lib/placement-api';
import type { TimelineEvent } from '@/types/placement';
import { PlusIcon } from '@/components/ui/Icons';
import { showToast } from '@/components/ToastProvider';

export function TimelineSection() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 16),
  });

  const loadEvents = async () => {
    try {
      const data = await timelineApi.getAll();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load timeline events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ title: '', description: '', date: new Date().toISOString().slice(0, 16) });
    setModalOpen(true);
  };

  const handleOpenEdit = (event: TimelineEvent) => {
    setEditingId(event._id);
    setForm({
      title: event.title,
      description: event.description || '',
      date: new Date(event.date).toISOString().slice(0, 16),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await timelineApi.update(editingId, {
          title: form.title,
          description: form.description,
          date: new Date(form.date).toISOString(),
        });
        showToast('Event updated!', 'success');
      } else {
        await timelineApi.create({
          title: form.title,
          description: form.description,
          date: new Date(form.date).toISOString(),
        });
        showToast('Event added to timeline!', 'success');
      }
      setModalOpen(false);
      setEditingId(null);
      setForm({ title: '', description: '', date: new Date().toISOString().slice(0, 16) });
      await loadEvents();
    } catch (err) {
      showToast(editingId ? 'Failed to update event' : 'Failed to add event', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      await timelineApi.delete(id);
      showToast('Event deleted', 'success');
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      showToast('Failed to delete event', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold tracking-tight dark:text-white">Timeline & Important Dates</h3>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400">Track upcoming tests, interviews, and deadlines</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-mono text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          <PlusIcon className="w-3 h-3" /> ADD EVENT
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm font-mono border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
          No important dates scheduled yet.
        </div>
      ) : (
        <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-4 space-y-6 pb-4">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const isCompleted = eventDate < new Date();
            
            return (
              <div key={event._id} className="relative pl-6 group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-white dark:border-[#161522] ${isCompleted ? 'bg-gray-300 dark:bg-gray-600' : 'bg-black dark:bg-white'}`} />
                
                <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/60 hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${isCompleted ? 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'}`}>
                          {isCompleted ? 'COMPLETED' : 'UPCOMING'}
                        </span>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {eventDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleOpenEdit(event)}
                        className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white transition-all rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                        title="Edit Event"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(event._id)}
                        className="p-1.5 text-gray-400 hover:text-rose-500 transition-all rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Delete Event"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
          <div className="bg-white dark:bg-[#161522] rounded-3xl shadow-2xl w-full max-w-sm border border-gray-200/80 dark:border-gray-800/80 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/40">
              <h2 className="text-xl font-bold tracking-tight dark:text-white">
                {editingId ? 'Edit Event' : 'Add Important Date'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  EVENT TITLE *
                </label>
                <input
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. Google Online Assessment"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  DATE & TIME *
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Any extra details, links, or prep focus..."
                />
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-black text-white dark:bg-white dark:text-black font-mono text-[11px] font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-sm"
                >
                  {saving ? 'SAVING…' : editingId ? 'UPDATE EVENT' : 'SAVE EVENT'}
                </button>
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setEditingId(null); }}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono text-[11px] font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
