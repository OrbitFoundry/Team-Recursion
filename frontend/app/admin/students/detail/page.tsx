'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminRoute from '@/components/AdminRoute';
import AppLayout from '@/components/AppLayout';
import { adminApi } from '@/lib/placement-api';
import { TechStackBadge } from '@/components/ui/TechStackSelector';
import type { Company, CompanyStatus, StudentUser } from '@/types/placement';

const STATUS_BADGE: Record<CompanyStatus, string> = {
  'Applied': 'bg-[#1f1d3d] text-white dark:bg-white dark:text-black',
  'Online Assessment': 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300',
  'Selected': 'bg-[#c8e6cd] text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300',
  'Rejected': 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300',
};

function StudentDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentId = searchParams.get('id');

  const [student, setStudent] = useState<StudentUser | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) {
      setError('No student ID provided');
      setLoading(false);
      return;
    }

    adminApi.getStudentDetail(studentId)
      .then((data) => {
        setStudent(data.student);
        setCompanies(data.companies);
      })
      .catch((err) => {
        const msg = err.response?.data?.error?.message || 'Failed to load student profile';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push('/admin/students')}
          className="text-xs font-mono font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          ← BACK TO DIRECTORY
        </button>
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 p-6 rounded-3xl border border-rose-200 dark:border-rose-900/50 font-mono text-sm">
          {error || 'Student not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Back Button */}
      <div>
        <button
          onClick={() => router.push('/admin/students')}
          className="text-xs font-mono font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          ← BACK TO DIRECTORY
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white dark:bg-[#161522] p-6 md:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#c5b0f4] text-black font-extrabold flex items-center justify-center text-xl shadow-sm">
            {student.name[0]?.toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight dark:text-white">{student.name}</h2>
            <p className="text-sm font-mono text-gray-500 dark:text-gray-400">{student.email}</p>
            <div className="flex items-center gap-2 pt-1">
              {student.isEmailVerified ? (
                <span className="px-2 py-0.5 bg-[#c8e6cd] text-emerald-950 text-[9px] font-mono font-bold rounded">
                  VERIFIED
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 text-[9px] font-mono font-bold rounded">
                  UNVERIFIED
                </span>
              )}
              <span className="text-[10px] font-mono text-gray-400">
                Joined {new Date(student.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Tech Stacks */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
              CORE TECH PORTFOLIO
            </div>
            {student.techStacks && student.techStacks.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-w-xs">
                {student.techStacks.map((ts) => (
                  <TechStackBadge key={ts} stack={ts} />
                ))}
              </div>
            ) : (
              <span className="text-xs font-mono text-gray-400">None specified</span>
            )}
          </div>

          {/* Resume */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
              PORTAL RESUME
            </div>
            {student.resumeUrl ? (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${student.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-mono text-[10px] font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-all shadow-sm"
              >
                DOWNLOAD PDF
              </a>
            ) : (
              <span className="text-xs font-mono text-gray-400 block py-1">No Resume Uploaded</span>
            )}
          </div>
        </div>
      </div>

      {/* Student Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#f4ecd6] text-black p-6 rounded-3xl border border-black/5 shadow-sm">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/60 mb-1">APPLICATIONS</div>
          <div className="text-3xl font-extrabold">{companies.length}</div>
        </div>
        <div className="bg-[#c8e6cd] text-black p-6 rounded-3xl border border-black/5 shadow-sm">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/60 mb-1">OFFERS RECEIVED</div>
          <div className="text-3xl font-extrabold">
            {companies.filter(c => c.status === 'Selected').length}
          </div>
        </div>
        <div className="bg-[#efd4d4] text-black p-6 rounded-3xl border border-black/5 shadow-sm">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/60 mb-1">REJECTIONS</div>
          <div className="text-3xl font-extrabold">
            {companies.filter(c => c.status === 'Rejected').length}
          </div>
        </div>
        <div className="bg-[#c5b0f4] text-black p-6 rounded-3xl border border-black/5 shadow-sm">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/60 mb-1">ACTIVE ROUNDS</div>
          <div className="text-3xl font-extrabold">
            {companies.filter(c => !['Selected', 'Rejected'].includes(c.status)).length}
          </div>
        </div>
      </div>

      {/* Application List */}
      <div className="bg-white dark:bg-[#161522] rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800/80">
          <h3 className="text-lg font-bold tracking-tight dark:text-white">Active Pipelines</h3>
          <p className="text-xs font-mono text-gray-500 mt-0.5">Granular tracking of interview rounds and stages</p>
        </div>

        {companies.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm font-mono border-2 border-dashed border-gray-100 dark:border-gray-800 m-6 rounded-2xl">
            No job applications recorded for this student.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800/80 text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="py-4 px-6">COMPANY</th>
                  <th className="py-4 px-6">ROLE</th>
                  <th className="py-4 px-6">CURRENT ROUND / STATUS</th>
                  <th className="py-4 px-6">APPLICATION DATE</th>
                  <th className="py-4 px-6">TECH STACK REQUIRED</th>
                  <th className="py-4 px-6">NOTES</th>
                  <th className="py-4 px-6 text-right">LINK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                {companies.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                      {c.companyName}
                    </td>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                      {c.role}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {new Date(c.applicationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">
                      {c.techStacks && c.techStacks.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.techStacks.map((ts) => (
                            <span key={ts} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 font-mono text-[9px] rounded">
                              {ts}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-mono">None</span>
                      )}
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2" title={c.notes}>
                        {c.notes || '-'}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {c.companyLink ? (
                        <a
                          href={c.companyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-black dark:hover:text-white transition-colors inline-block"
                          title="Visit job posting"
                        >
                          <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-700">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentDetailPage() {
  return (
    <AdminRoute>
      <AppLayout>
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          </div>
        }>
          <StudentDetailContent />
        </Suspense>
      </AppLayout>
    </AdminRoute>
  );
}
