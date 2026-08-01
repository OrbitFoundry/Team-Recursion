'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { dashboardApi } from '@/lib/placement-api';
import { useAuth } from '@/contexts/AuthContext';
import type { DashboardStats, CompanyStatus } from '@/types/placement';

const STATUS_COLORS: Record<CompanyStatus, string> = {
  'Applied': '#6366f1',
  'Online Assessment': '#f59e0b',
  'Technical Interview': '#3b82f6',
  'HR Interview': '#8b5cf6',
  'Selected': '#10b981',
  'Rejected': '#ef4444',
};

const STATUS_BADGE: Record<CompanyStatus, string> = {
  'Applied': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Online Assessment': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'Selected': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

function StatCard({
  label, value, sub, color,
}: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${color}`}>
        <div className="w-4 h-4 rounded-full bg-current opacity-80" />
      </div>
      <div className="text-3xl font-bold dark:text-white">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.getStats()
      .then(setStats)
      .catch(() => setError('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = stats
    ? Object.entries(stats.statusBreakdown).map(([status, count]) => ({
        status,
        count,
        fill: STATUS_COLORS[status as CompanyStatus] || '#6366f1',
      }))
    : [];

  return (
    <AppLayout>
      {/* Welcome header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Here&apos;s your placement journey at a glance.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Applied" value={stats.totalApplied} color="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600" />
            <StatCard label="Active (In Progress)" value={stats.totalActive} color="bg-amber-100 dark:bg-amber-900/40 text-amber-600" />
            <StatCard label="Offers / Selected" value={stats.totalOffers} color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600" />
            <StatCard
              label="Rejected"
              value={stats.totalRejected}
              sub={`Success Rate: ${stats.successRate}%`}
              color="bg-red-100 dark:bg-red-900/40 text-red-500"
            />
          </div>

          {/* Chart + recent */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Status breakdown chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-base font-semibold mb-4 dark:text-white">Application Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={32}>
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#1f2937',
                      border: 'none',
                      borderRadius: 8,
                      color: '#f9fafb',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent applications */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-base font-semibold mb-4 dark:text-white">Recent Applications</h3>
              {stats.recentApplications.length === 0 ? (
                <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
                  No applications yet. Start adding!
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentApplications.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-sm dark:text-white">{app.companyName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{app.role}</div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/companies"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
            >
              ＋ Add Company
            </Link>
            <Link
              href="/resources"
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-colors shadow-sm"
            >
              ＋ Add Resource
            </Link>
          </div>
        </>
      )}
    </AppLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
