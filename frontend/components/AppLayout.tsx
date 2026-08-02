'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  DashboardIcon,
  CompanyIcon,
  ResourceIcon,
  ProfileIcon,
  AnalyticsIcon,
  StudentsIcon,
  LogoutIcon,
  SunIcon,
  MoonIcon,
  CookedBrandIcon,
} from '@/components/ui/Icons';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-4 h-4" /> },
  { href: '/companies', label: 'Applications', icon: <CompanyIcon className="w-4 h-4" /> },
  { href: '/resources', label: 'Resource Hub', icon: <ResourceIcon className="w-4 h-4" /> },
  { href: '/profile', label: 'Profile', icon: <ProfileIcon className="w-4 h-4" /> },
];

const adminItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Admin Control', icon: <AnalyticsIcon className="w-4 h-4" /> },
  { href: '/admin/students', label: 'Cohort Roster', icon: <StudentsIcon className="w-4 h-4" /> },
  { href: '/admin/companies', label: 'Master Register', icon: <CompanyIcon className="w-4 h-4" /> },
  { href: '/admin/resources', label: 'Moderation Hub', icon: <ResourceIcon className="w-4 h-4" /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0f0e17] text-gray-900 dark:text-gray-100 flex font-sans selection:bg-[#c5b0f4]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in-up"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col w-64 bg-white dark:bg-[#161522] border-r border-gray-200 dark:border-gray-800/80 shadow-2xl lg:shadow-none transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Icon Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800/80">
          <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm bg-black dark:bg-white flex items-center justify-center shrink-0">
            <CookedBrandIcon className="w-5 h-5 text-white dark:text-black" />
          </div>
          <div>
            <div className="font-extrabold text-base text-gray-900 dark:text-white tracking-tight flex items-center gap-1">
              cooked?
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
              CAREER PORTAL
            </div>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-4 mb-2">
              Student Space
            </div>
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/profile' && !pathname.startsWith('/admin') && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                    active
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {isAdmin && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-4 mb-2">
                Admin Panel
              </div>
              {adminItems.map((item) => {
                const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                      active
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-2xl bg-gray-50 dark:bg-gray-900/60">
            <div className="w-8 h-8 rounded-full bg-[#c5b0f4] flex items-center justify-center text-black font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate text-gray-900 dark:text-white">{user?.name || 'User'}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate font-mono">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium font-mono text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-colors"
          >
            <LogoutIcon className="w-4 h-4" /> SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#161522]/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 px-4 md:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle sidebar menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base font-bold tracking-tight text-gray-900 dark:text-white font-sans">
              {pathname === '/dashboard'
                ? 'Student Dashboard'
                : pathname === '/companies'
                ? 'Applications Tracker'
                : pathname === '/resources'
                ? 'Resource Center'
                : pathname === '/profile'
                ? 'Account Settings'
                : 'cooked?'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-[#dceeb1] text-black font-semibold">
              cooked?
            </div>
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              title="Toggle theme"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
}
