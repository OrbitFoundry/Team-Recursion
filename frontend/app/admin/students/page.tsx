'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/AdminRoute';
import AppLayout from '@/components/AppLayout';
import { adminApi } from '@/lib/placement-api';
import { StudentsIcon } from '@/components/ui/Icons';
import { TechStackBadge } from '@/components/ui/TechStackSelector';
import { getMediaUrl } from '@/lib/utils';
import type { StudentUser } from '@/types/placement';

function AdminStudentsContent() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const fetchStudents = (query?: string) => {
    setLoading(true);
    adminApi.getStudents({ search: query })
      .then(setStudents)
      .catch(() => setError('Failed to load student directory'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle local filtering in addition to backend search if needed
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.techStacks?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <AppLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#161522] p-6 md:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gray-500 mb-1">
              <StudentsIcon className="w-4 h-4 text-black dark:text-white" /> COHORT DIRECTORY
            </div>
            <h2 className="text-2xl font-bold tracking-tight dark:text-white">Student Roster</h2>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
              Manage student accounts, verify profiles, and inspect technical stack portfolios.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Proactively trigger search with a simple debounce if desired, or just search locally
              }}
              placeholder="Search by name, email, stack..."
              className="w-full px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
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
            {filteredStudents.length === 0 ? (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm font-mono">
                No students match your query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans">
                  <thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800/80 text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="py-4 px-6">STUDENT</th>
                      <th className="py-4 px-6">STATUS</th>
                      <th className="py-4 px-6">TECH STACKS</th>
                      <th className="py-4 px-6 text-center">APPLICATIONS</th>
                      <th className="py-4 px-6 text-center">OFFERS</th>
                      <th className="py-4 px-6">LAST ACTIVITY</th>
                      <th className="py-4 px-6 text-right">RESUME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                    {filteredStudents.map((s) => (
                      <tr
                        key={s._id}
                        onClick={() => router.push(`/admin/students/detail?id=${s._id}`)}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40 cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#c5b0f4] text-black font-bold flex items-center justify-center text-xs shrink-0 shadow-sm font-sans">
                              {s.name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white">{s.name}</div>
                              <div className="text-xs font-mono text-gray-500 dark:text-gray-400">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {s.isEmailVerified ? (
                            <span className="px-2.5 py-1 bg-[#c8e6cd] text-emerald-950 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
                              VERIFIED
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">
                              UNVERIFIED
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {s.techStacks && s.techStacks.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {s.techStacks.slice(0, 3).map((ts) => (
                                <TechStackBadge key={ts} stack={ts} />
                              ))}
                              {s.techStacks.length > 3 && (
                                <span className="text-[10px] font-mono text-gray-400">+{s.techStacks.length - 3}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs font-mono text-gray-400">None specified</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center font-mono font-bold text-gray-900 dark:text-white">
                          {s.totalApplications}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {s.selectedOffers}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-gray-500 dark:text-gray-400">
                          {s.lastActivity ? new Date(s.lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No activity'}
                        </td>
                        <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          {s.resumeUrl ? (
                            <a
                              href={getMediaUrl(s.resumeUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white dark:bg-white dark:text-black font-mono text-[10px] font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-all"
                            >
                              VIEW PDF
                            </a>
                          ) : (
                            <span className="text-xs font-mono text-gray-400">No Resume</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function AdminStudentsPage() {
  return (
    <AdminRoute>
      <AdminStudentsContent />
    </AdminRoute>
  );
}
