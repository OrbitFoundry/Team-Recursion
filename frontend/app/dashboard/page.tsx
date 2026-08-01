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
import { PlusIcon, ResourceIcon, ArrowRightIcon } from '@/components/ui/Icons';
import type { DashboardStats, CompanyStatus } from '@/types/placement';
import { TimelineSection } from '@/components/ui/TimelineSection';

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
  'Online Assessment': 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
  'Technical Interview': 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
  'HR Interview': 'bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300',
  'Selected': 'bg-[#c8e6cd] text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300',
  'Rejected': 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300',
};

function StatCard({
  label, value, sub, bgClass, textClass,
}: { label: string; value: string | number; sub?: string; bgClass: string; textClass: string }) {
  return (
    <div className={`rounded-3xl p-6 transition-all hover-lift ${bgClass} border border-black/5 shadow-sm`}>
      <div className="text-4xl font-extrabold tracking-tight mb-2 font-sans">{value}</div>
      <div className={`text-xs font-mono font-bold uppercase tracking-wider ${textClass}`}>{label}</div>
      {sub && <div className="text-[11px] font-mono opacity-80 mt-1">{sub}</div>}
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
        fill: STATUS_COLORS[status as CompanyStatus] || '#1f1d3d',
      }))
    : [];

  return (
    <AppLayout>
      {/* Editorial Welcome Section */}
      <div className="mb-8 p-8 rounded-3xl bg-[#c5b0f4] text-black relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-black text-white text-[11px] font-mono uppercase tracking-widest mb-3">
            cooked? PULSE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
            Welcome back, {user?.name?.split(' ')[0]}
          </h2>
          <p className="text-black/80 mt-2 text-sm leading-relaxed font-sans">
            Here is your live placement story. Track interview pipelines, monitor application statuses, and accelerate your prep.
          </p>
        </div>
        <div className="absolute -right-8 -bottom-10 opacity-10 text-9xl font-black pointer-events-none select-none">
          cooked?
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
          {/* Stat cards in signature pastel color blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Applied" value={stats.totalApplied} bgClass="bg-[#dceeb1] text-black" textClass="text-black/70" />
            <StatCard label="Active Pipeline" value={stats.totalActive} bgClass="bg-[#f4ecd6] text-black" textClass="text-black/70" />
            <StatCard label="Offers / Selected" value={stats.totalOffers} bgClass="bg-[#c8e6cd] text-black" textClass="text-black/70" />
            <StatCard
              label="Rejected"
              value={stats.totalRejected}
              sub={`Success Rate: ${stats.successRate}%`}
              bgClass="bg-[#efd4d4] text-black"
              textClass="text-black/70"
            />
          </div>

          {/* Chart + Recent Applications */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Status breakdown chart */}
            <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold tracking-tight dark:text-white">Pipeline Breakdown</h3>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400">Distribution by stage</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-medium">LIVE DATA</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} barSize={28}>
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 10, fill: '#888' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={55}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#000000',
                      border: 'none',
                      borderRadius: 12,
                      color: '#ffffff',
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent applications */}
            <div className="bg-white dark:bg-[#161522] rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold tracking-tight dark:text-white">Recent Submissions</h3>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400">Latest 5 company entries</p>
                </div>
                <Link href="/companies" className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-black dark:text-white hover:underline font-bold">
                  VIEW ALL <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>

              {stats.recentApplications.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm font-mono">
                  No applications recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentApplications.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/60 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="font-bold text-sm truncate dark:text-white">{app.companyName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.role}</div>
                      </div>
                      <span className={`text-[11px] font-mono uppercase font-semibold px-3 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black text-xs font-mono uppercase tracking-wider font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              <PlusIcon className="w-4 h-4" /> ADD NEW APPLICATION
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#f4ecd6] text-black text-xs font-mono uppercase tracking-wider font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              <ResourceIcon className="w-4 h-4" /> BROWSE PREP RESOURCES
            </Link>
          </div>

          {/* Timeline Section */}
          <TimelineSection />
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
