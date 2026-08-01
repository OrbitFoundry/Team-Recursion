'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(isAdmin ? '/admin/dashboard' : '/dashboard');
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                PP
              </div>
              <h1 className="text-xl font-bold text-gray-900">PlacementPortal</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Master Your Placement
            <span className="text-indigo-600"> Journey & Career</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track job applications, organize interview resources, monitor selection stages, and boost your hiring chances with our campus placement platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button className="px-8 py-3 text-lg bg-indigo-600 hover:bg-indigo-700">Get Started Free</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="px-8 py-3 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-indigo-600 text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">Application Tracker</h3>
            <p className="text-gray-600">
              Keep full track of applied companies, online assessments, technical interviews, and offer statuses.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-indigo-600 text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Resource Repository</h3>
            <p className="text-gray-600">
              Access curated preparation sheets for DSA, Aptitude, Core Computer Science subjects, and resumes.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-indigo-600 text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Admin Analytics</h3>
            <p className="text-gray-600">
              Comprehensive administrative dashboards for monitoring student progress, offers, and company statistics.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Team Recursion (Mallu, Bhumit, Ayush, Gaurav). All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
