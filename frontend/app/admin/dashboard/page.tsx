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
  'Applied': '#1f1d3d',
  'Online Assessment': '#f59e0b',
  'Technical Interview': '#3b82f6',
  'HR Interview': '#8b5cf6',
  'Selected': '#10b981',
  'Rejected': '#ef4444',
};

const STATUS_BADGE: Record<CompanyStatus, string> = {
  'Applied': 'bg-[#1f1d3d] text-white dark:bg-white dark:text-black',
  'Online Assessment': 'bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-950 dark:bg-blue-950/60 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-950 dark:bg-purple-950/60 dark:text-purple-300',
  'Selected': 'bg-[#c8e6cd] text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300',
  'Rejected': 'bg-rose-100 text-rose-950 dark:bg-rose-950/60 dark:text-rose-300',
};

function GlobalStatCard({ label, value, icon, bgClass, textClass }: { label: string; value: number; icon: string; bgClass: string; textClass: string }) {
  return (
    <div className={`rounded-3xl p-6 transition-all hover-lift ${bgClass} border border-black/5 shadow-sm`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-4xl font-extrabold tracking-tight font-sans mb-1">{value.toLocaleString()}</div>
      <div className={`text-xs font-mono font-bold uppercase tracking-wider ${textClass}`}>{label}</div>
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
      .catch(() => setError('Failed to load admin dashboard overview'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStats(); }, []);

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Remove this resource from the repository?')) return;
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
        fill: STATUS_COLORS[status as CompanyStatus] || '#1f1d3d',
      }))
    : [];

  const pieData = chartData.filter(d => d.count > 0);

  return (
    <AppLayout>
      {/* Admin Hero Section */}
      <div className="mb-8 p-8 rounded-3xl bg-[#1f1d3d] text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-white text-black text-[11px] font-mono uppercase tracking-widest mb-3">
            ADMINISTRATIVE CONTROL
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Institutional Overview
          </h2>
          <p className="text-gray-300 mt-2 text-sm leading-relaxed font-sans">
            Real-time analytics across all registered students, applications, offers, and preparation resources.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 p-4 rounded-2xl text-sm font-medium mb-6 border border-rose-200 dark:border-rose-900/50">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Global Stat Cards in Signature Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <GlobalStatCard
              label="TOTAL REGISTERED STUDENTS"
              value={stats.totalStudents}
              icon="🎓"
              bgClass="bg-[#c5b0f4] text-black"
              textClass="text-black/70"
            />
            <GlobalStatCard
              label="TOTAL APPLICATIONS"
              value={stats.totalApplications}
              icon="📋"
              bgClass="bg-[#dceeb1] text-black"
              textClass="text-black/70"
            />
            <GlobalStatCard
              label="TOTAL OFFERS (SELECTED)"
              value={stats.totalOffers}
              icon="🎉"
              bgClass="bg-[#c8e6cd] text-black"
              textClass="text-black/70"
            />
            <GlobalStatCard
              label="TOTAL REJECTIONS"
              value={stats.totalRejections}
              icon="📉"
              bgClass="bg-[#efd4d4] text-black"
              textClass="text-black/70"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Status bar chart */}
            <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-1 dark:text-white">Global Status Breakdown</h3>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-6">Total candidates across pipeline stages</p>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={chartData} barSize={28}>
                  <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#888' }} interval={0} angle={-15} textAnchor="end" height={55} />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#000000', border: 'none', borderRadius: 12, color: '#ffffff', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-1 dark:text-white">Pipeline Share</h3>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-6">Relative distribution of active applications</p>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#000000', border: 'none', borderRadius: 12, color: '#ffffff', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Companies + Recent Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Top companies */}
            <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight dark:text-white mb-1">🏆 Most Applied Companies</h3>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-6">Top recruiters by student interest</p>
              <div className="space-y-3.5">
                {stats.topCompanies.map((c, i) => (
                  <div key={c.companyName} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-mono font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold dark:text-white truncate">{c.companyName}</div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-[#c5b0f4] rounded-full transition-all"
                          style={{ width: `${Math.min(100, (c.count / (stats.topCompanies[0]?.count || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-400 w-8 text-right">
                      {c.count}
                    </span>
                  </div>
                ))}
                {stats.topCompanies.length === 0 && (
                  <div className="text-xs font-mono text-gray-400 dark:text-gray-500 py-6 text-center">No company data recorded</div>
                )}
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight dark:text-white mb-1">⚡ Recent Student Submissions</h3>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-6">Latest activity log across campus</p>
              <div className="space-y-2.5">
                {stats.recentActivity.slice(0, 5).map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/60"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-sm font-bold dark:text-white truncate">{a.companyName}</div>
                      <div className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate">{a.student.name} ({a.student.email})</div>
                    </div>
                    <span className={`shrink-0 text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resource Moderation Panel */}
          <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold tracking-tight dark:text-white">🔍 Resource Moderation Feed</h3>
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">Review student uploaded prep materials</p>
              </div>
              <Link href="/admin/resources" className="text-xs font-mono uppercase font-bold text-black dark:text-white hover:underline">
                VIEW ALL →
              </Link>
            </div>
            <div className="space-y-2.5">
              {stats.recentResources.map((r) => (
                <div key={r._id} className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/60">
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="text-sm font-bold dark:text-white truncate">{r.title}</div>
                    <div className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      BY {r.student.name.toUpperCase()} · CATEGORY: {r.category.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteResource(r._id)}
                    disabled={deletingResource === r._id}
                    className="shrink-0 text-xs font-mono font-bold uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
                  >
                    {deletingResource === r._id ? '…' : 'REMOVE'}
                  </button>
                </div>
              ))}
              {stats.recentResources.length === 0 && (
                <div className="text-xs font-mono text-gray-400 dark:text-gray-500 py-6 text-center">No pending resources to moderate</div>
              )}
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/students" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm">
              <span>🎓</span> VIEW ALL STUDENTS
            </Link>
            <Link href="/admin/companies" className="inline-flex items-center gap-2 px-6 py-3 bg-[#dceeb1] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm">
              <span>🏢</span> MANAGE ALL APPLICATIONS
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
