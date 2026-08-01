'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { adminApi } from '@/lib/placement-api';
import type { AdminStudent } from '@/types/placement';

function StudentsContent() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.getStudents()
      .then(setStudents)
      .catch(() => setError('Failed to load registered student profiles'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 font-sans">
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">Registered Candidates</h2>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">Directory of all registered students and their placement metrics</p>
        </div>
      </div>

      {/* Toolbar Search */}
      <div className="mb-6">
        <input
          className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161522] text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all placeholder-gray-400 font-sans"
          placeholder="Search by student name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 p-4 rounded-2xl text-xs font-mono mb-6 border border-rose-200 dark:border-rose-900/50">
          {error}
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm overflow-hidden font-sans">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-mono">
            <div className="text-5xl mb-3">🎓</div>
            <div className="text-sm font-semibold">NO STUDENTS FOUND</div>
            <div className="text-xs text-gray-400 mt-1">Try adjusting your search criteria</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/40 text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4 font-semibold">STUDENT</th>
                  <th className="px-6 py-4 font-semibold">EMAIL</th>
                  <th className="px-6 py-4 font-semibold">APPLICATIONS</th>
                  <th className="px-6 py-4 font-semibold">OFFERS</th>
                  <th className="px-6 py-4 font-semibold">LAST ACTIVITY</th>
                  <th className="px-6 py-4 text-right">PROFILE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm">
                {filtered.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#c5b0f4] text-black font-bold text-xs flex items-center justify-center shrink-0">
                          {s.name[0]?.toUpperCase()}
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">{s.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">{s.email}</td>
                    <td className="px-6 py-4 font-mono font-bold text-black dark:text-white">{s.applicationCount}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{s.offerCount}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {s.lastActivity ? new Date(s.lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'NO ACTIVITY'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/students/${s._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-bold bg-black text-white dark:bg-white dark:text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm"
                      >
                        VIEW PROFILE →
                      </Link>
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
          TOTAL CANDIDATES: {filtered.length}
        </div>
      )}
    </AppLayout>
  );
}

export default function AdminStudentsPage() {
  return (
    <ProtectedRoute adminOnly>
      <StudentsContent />
    </ProtectedRoute>
  );
}
