'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import { adminApi } from '@/lib/placement-api';
import type { AdminDashboardStats, CompanyStatus } from '@/types/placement';

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

function GlobalStatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className={`rounded-2xl p-6 border shadow-sm ${color}`}>
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-3xl font-bold">{value.toLocaleString()}</div>
      <div className="text-sm opacity-80 mt-1">{label}</div>
    </div>
  );
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingResource, setDeletingResource] = useState<string | null>(null);

  const loadStats = () => {
    setLoading(true);
    adminApi.getDashboardStats()
      .then(setStats)
      .catch(() => setError('Failed to load admin dashboard'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStats(); }, []);

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Remove this resource?')) return;
    setDeletingResource(id);
    try {
      await adminApi.deleteResource(id);
      setStats(prev => prev ? {
        ...prev,
        recentResources: prev.recentResources.filter(r => r._id !== id),
      } : prev);
    } finally {
      setDeletingResource(null);
    }
  };

  const chartData = stats
    ? Object.entries(stats.statusBreakdown).map(([status, count]) => ({
        status,
        count,
        fill: STATUS_COLORS[status as CompanyStatus] || '#6366f1',
      }))
    : [];

  const pieData = chartData.filter(d => d.count > 0);

  return (
    <AppLayout>
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
          {/* Global stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <GlobalStatCard
              label="Total Students"
              value={stats.totalStudents}
              icon="🎓"
              color="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200"
            />
            <GlobalStatCard
              label="Total Applications"
              value={stats.totalApplications}
              icon="📋"
              color="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200"
            />
            <GlobalStatCard
              label="Total Offers (Selected)"
              value={stats.totalOffers}
              icon="🎉"
              color="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
            />
            <GlobalStatCard
              label="Total Rejections"
              value={stats.totalRejections}
              icon="📉"
              color="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-800 dark:text-red-200"
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Status bar chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-base font-semibold mb-4 dark:text-white">Global Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={32}>
                  <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#f9fafb', fontSize: 12 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-base font-semibold mb-4 dark:text-white">Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#f9fafb', fontSize: 12 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top companies + Recent activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Top companies */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-base font-semibold mb-4 dark:text-white">🏆 Top Companies Applied To</h3>
              <div className="space-y-3">
                {stats.topCompanies.map((c, i) => (
                  <div key={c.companyName} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium dark:text-white truncate">{c.companyName}</div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${Math.min(100, (c.count / (stats.topCompanies[0]?.count || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-8 text-right">
                      {c.count}
                    </span>
                  </div>
                ))}
                {stats.topCompanies.length === 0 && (
                  <div className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No data yet</div>
                )}
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-base font-semibold mb-4 dark:text-white">⚡ Recent Activity</h3>
              <div className="space-y-2">
                {stats.recentActivity.slice(0, 6).map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium dark:text-white truncate">{a.companyName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{a.student.name}</div>
                    </div>
                    <span className={`ml-2 shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resource moderation panel */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold dark:text-white">🔍 Recent Resources (Moderation)</h3>
              <Link href="/admin/resources" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {stats.recentResources.map((r) => (
                <div key={r._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium dark:text-white truncate">{r.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {r.student.name} · {r.category}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteResource(r._id)}
                    disabled={deletingResource === r._id}
                    className="ml-3 shrink-0 text-xs text-red-500 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingResource === r._id ? '…' : 'Remove'}
                  </button>
                </div>
              ))}
              {stats.recentResources.length === 0 && (
                <div className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">No resources yet</div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/students" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors">
              View All Students →
            </Link>
            <Link href="/admin/companies" className="px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-colors">
              Manage Applications →
            </Link>
          </div>
        </>
      )}
    </AppLayout>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
