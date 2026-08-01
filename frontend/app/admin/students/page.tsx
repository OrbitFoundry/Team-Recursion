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
      .catch(() => setError('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search by name or email…"
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
            <div className="text-4xl mb-3">🎓</div>
            <div className="text-sm">No students found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Applied</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Offers</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Last Activity</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-xs font-bold shrink-0">
                          {s.name[0]?.toUpperCase()}
                        </div>
                        <div className="font-medium dark:text-white">{s.name}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{s.email}</td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{s.applicationCount}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{s.offerCount}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      {s.lastActivity ? new Date(s.lastActivity).toLocaleDateString() : 'No activity'}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/students/${s._id}`}
                        className="text-xs px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors"
                      >
                        View →
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
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} student{filtered.length !== 1 ? 's' : ''}
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
