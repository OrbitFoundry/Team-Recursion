'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ClipboardIcon, ResourceIcon, AnalyticsIcon, ArrowRightIcon } from '@/components/ui/Icons';

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
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0c0b10]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0c0b10] dark:text-white font-sans selection:bg-[#c5b0f4] selection:text-black">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0c0b10]/80 backdrop-blur-md border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold flex items-center justify-center text-sm font-sans tracking-tight">
              TR
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-none">TEAM RECURSION</span>
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Placement Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold uppercase tracking-wider transition-all"
            >
              SIGN IN
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Story Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Story Block 1: Lilac Hero */}
        <section className="rounded-3xl bg-[#c5b0f4] text-black p-8 md:p-16 relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-block px-3.5 py-1 rounded-full bg-black text-white text-[11px] font-mono uppercase tracking-widest mb-6 font-bold">
              CAMPUS PLACEMENT ENGINE
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black leading-[1.08] mb-6">
              Master Your Placement Journey &amp; Accelerate Your Career.
            </h1>
            <p className="text-base md:text-lg text-black/80 max-w-xl font-sans leading-relaxed mb-8">
              Track job applications, organize interview preparation resources, monitor selection stages, and gain actionable placement insights.
            </p>
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs font-bold uppercase tracking-wider">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                CREATE ACCOUNT FREE <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-full bg-white text-black border border-black/10 hover:bg-gray-100 transition-all"
              >
                STUDENT &amp; ADMIN LOGIN
              </Link>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-16 opacity-10 text-[200px] font-black pointer-events-none select-none">
            RECURSION
          </div>
        </section>

        {/* Story Block 2: Feature Grid in Pastel Colors */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lime Card */}
          <div className="rounded-3xl bg-[#dceeb1] text-black p-8 transition-all hover-lift border border-black/5 shadow-sm">
            <div className="w-8 h-8 mb-4">
              <ClipboardIcon className="w-full h-full text-black" />
            </div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/60 mb-2">MODULE 01</div>
            <h3 className="text-2xl font-bold tracking-tight mb-3">Application Pipeline</h3>
            <p className="text-sm text-black/80 leading-relaxed font-sans">
              Keep granular track of applied companies, online assessments, technical rounds, HR interviews, and selection statuses.
            </p>
          </div>

          {/* Cream Card */}
          <div className="rounded-3xl bg-[#f4ecd6] text-black p-8 transition-all hover-lift border border-black/5 shadow-sm">
            <div className="w-8 h-8 mb-4">
              <ResourceIcon className="w-full h-full text-black" />
            </div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/60 mb-2">MODULE 02</div>
            <h3 className="text-2xl font-bold tracking-tight mb-3">Prep Resource Hub</h3>
            <p className="text-sm text-black/80 leading-relaxed font-sans">
              Access and contribute curated preparation sheets for Data Structures &amp; Algorithms, Aptitude, Core CS subjects, and resumes.
            </p>
          </div>

          {/* Mint Card */}
          <div className="rounded-3xl bg-[#c8e6cd] text-black p-8 transition-all hover-lift border border-black/5 shadow-sm">
            <div className="w-8 h-8 mb-4">
              <AnalyticsIcon className="w-full h-full text-black" />
            </div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-black/60 mb-2">MODULE 03</div>
            <h3 className="text-2xl font-bold tracking-tight mb-3">Admin Intelligence</h3>
            <p className="text-sm text-black/80 leading-relaxed font-sans">
              Institutional dashboard providing real-time metrics across registered students, company offers, and student activity moderation.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 mt-20 py-10 bg-gray-50 dark:bg-[#08070c]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500 dark:text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} <span className="font-bold text-black dark:text-white">TEAM RECURSION</span> (Mallu, Bhumit, Ayush, Gaurav).
          </div>
          <div className="flex gap-4 uppercase font-bold tracking-wider">
            <span>Inter Font</span>
            <span>·</span>
            <span>JetBrains Mono</span>
            <span>·</span>
            <span>Tailwind v4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
