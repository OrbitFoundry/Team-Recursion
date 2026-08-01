'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { adminApi } from '@/lib/placement-api';
import type { AdminStudent, Company, CompanyStatus } from '@/types/placement';

const STATUS_BADGE: Record<CompanyStatus, string> = {
  'Applied': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Online Assessment': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Selected': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
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
      .catch(() => setError('Failed to load student data'))
      .finally(() => setLoading(false));
  }, [studentId]);

  return (
    <AppLayout>
      <button
        onClick={() => router.push('/admin/students')}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        ← Back to Students
      </button>

      {student && (
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-lg font-bold">
            {student.name[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white">{student.name}</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
          </div>
          <div className="ml-auto flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-xl text-indigo-600 dark:text-indigo-400">{companies.length}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Applied</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-emerald-600 dark:text-emerald-400">
                {companies.filter(c => c.status === 'Selected').length}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Offers</div>
            </div>
          </div>
        </div>
      )}

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
        ) : companies.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">
            No applications yet for this student.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Company</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Notes</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="px-5 py-3 font-medium dark:text-white">{c.companyName}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{c.role}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                      {new Date(c.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-500 max-w-xs truncate">
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
