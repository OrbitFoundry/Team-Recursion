'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const studentNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/companies', label: 'My Applications', icon: '🏢' },
  { href: '/resources', label: 'Resources', icon: '📚' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'Admin Dashboard', icon: '📈' },
  { href: '/admin/students', label: 'Students', icon: '🎓' },
  { href: '/admin/companies', label: 'All Applications', icon: '🏢' },
  { href: '/admin/resources', label: 'Resources', icon: '📚' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load dark mode preference
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

  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            PP
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">PlacementPortal</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isAdmin ? 'Admin View' : 'Student View'}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate dark:text-white">{user?.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title — from pathname */}
          <div className="flex-1 lg:flex lg:items-center ml-2 lg:ml-0">
            <h1 className="text-base font-semibold capitalize dark:text-white">
              {pathname === '/dashboard'
                ? 'My Dashboard'
                : pathname === '/companies'
                ? 'My Applications'
                : pathname === '/resources'
                ? 'My Resources'
                : pathname === '/admin/dashboard'
                ? 'Admin Dashboard'
                : pathname === '/admin/students'
                ? 'Students'
                : pathname === '/admin/companies'
                ? 'All Applications'
                : pathname === '/admin/resources'
                ? 'Resource Moderation'
                : 'Placement Portal'}
            </h1>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
