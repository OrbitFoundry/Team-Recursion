'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { adminApi } from '@/lib/placement-api';
import type { AdminStudent, Company, CompanyStatus } from '@/types/placement';

const STATUS_BADGE: Record<CompanyStatus, string> = {
  'Applied': 'bg-[#1f1d3d] text-white dark:bg-white dark:text-black',
  'Online Assessment': 'bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-950 dark:bg-blue-950/60 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-950 dark:bg-purple-950/60 dark:text-purple-300',
  'Selected': 'bg-[#c8e6cd] text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300',
  'Rejected': 'bg-rose-100 text-rose-950 dark:bg-rose-950/60 dark:text-rose-300',
};

function StudentCompaniesContent() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<AdminStudent | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getStudentCompanies(studentId)
      .then(({ student: s, companies: c }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setStudent(s as any);
        setCompanies(c);
      })
      .catch(() => setError('Failed to load student applications'))
      .finally(() => setLoading(false));
  }, [studentId]);

  return (
    <AppLayout>
      <button
        onClick={() => router.push('/admin/students')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-mono font-bold uppercase rounded-full mb-6 transition-all"
      >
        ← BACK TO STUDENTS
      </button>

      {student && (
        <div className="bg-[#c5b0f4] text-black rounded-3xl p-6 md:p-8 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold font-sans">
              {student.name[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/60">CANDIDATE DOSSIER</div>
              <h2 className="text-2xl font-bold tracking-tight text-black">{student.name}</h2>
              <div className="text-xs font-mono text-black/75">{student.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-black/5 dark:bg-black/10 p-4 rounded-2xl border border-black/10">
            <div className="text-center">
              <div className="font-extrabold text-2xl font-sans text-black">{companies.length}</div>
              <div className="text-[10px] font-mono uppercase font-bold text-black/70">APPLIED</div>
            </div>
            <div className="h-8 w-px bg-black/15" />
            <div className="text-center">
              <div className="font-extrabold text-2xl font-sans text-black">
                {companies.filter(c => c.status === 'Selected').length}
              </div>
              <div className="text-[10px] font-mono uppercase font-bold text-black/70">OFFERS</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 p-4 rounded-2xl text-xs font-mono mb-6 border border-rose-200 dark:border-rose-900/50">
          {error}
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm overflow-hidden font-sans">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-mono">
            <div className="text-5xl mb-3">📋</div>
            <div className="text-sm font-semibold">NO APPLICATIONS RECORDED FOR THIS STUDENT</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/40 text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4 font-semibold">COMPANY</th>
                  <th className="px-6 py-4 font-semibold">ROLE</th>
                  <th className="px-6 py-4 font-semibold">DATE</th>
                  <th className="px-6 py-4 font-semibold">STAGE</th>
                  <th className="px-6 py-4 font-semibold">NOTES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm">
                {companies.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{c.companyName}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{c.role}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {new Date(c.applicationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-mono uppercase font-semibold px-3 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {c.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function AdminStudentDetailPage() {
  return (
    <ProtectedRoute adminOnly>
      <StudentCompaniesContent />
    </ProtectedRoute>
  );
}
