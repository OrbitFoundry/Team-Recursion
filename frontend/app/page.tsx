'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  ClipboardIcon,
  ResourceIcon,
  AnalyticsIcon,
  ArrowRightIcon,
  CheckIcon,
  StudentsIcon,
  CompanyIcon,
  ExternalLinkIcon,
  CookedBrandIcon,
} from '@/components/ui/Icons';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0c0b10]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0c0b10] dark:text-white font-sans selection:bg-[#c5b0f4] selection:text-black">
      {/* 1. Sticky Monochrome Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0c0b10]/90 backdrop-blur-md border-b border-[#e6e6e6] dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm bg-black dark:bg-white flex items-center justify-center shrink-0">
              <CookedBrandIcon className="w-5 h-5 text-white dark:text-black" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight block leading-none font-sans">cooked?</span>
              <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">CAREER & PLACEMENT PORTAL</span>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-wider">
            <Link
              href="/login"
              className="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              SIGN IN
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Marquee Strip */}
      <div className="bg-black text-white dark:bg-white dark:text-black overflow-hidden py-2 font-mono text-[10px] uppercase tracking-widest font-semibold border-b border-black/10">
        <div className="flex gap-12 whitespace-nowrap animate-pulse justify-center items-center opacity-90">
          <span>cooked? RECRUITMENT ENGINE</span>
          <span>·</span>
          <span>REAL-TIME APPLICATION TRACKER</span>
          <span>·</span>
          <span>CURATED DSA & CORE CS HUB</span>
          <span>·</span>
          <span>INSTITUTIONAL METRICS</span>
          <span>·</span>
          <span>TEAM RECURSION</span>
        </div>
      </div>

      {/* Main Content Container with White Canvas Breathing Room */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* Story Block 1: Lilac Hero Panel */}
        <section className="rounded-3xl bg-[#c5b0f4] text-black p-8 md:p-16 relative overflow-hidden shadow-sm border border-black/5">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black text-white text-[11px] font-mono uppercase tracking-widest mb-6 font-bold">
              <span>✦</span> cooked? CAMPUS ENGINE
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black leading-[1.05] mb-6">
              Master Your Placement Journey with cooked?
            </h1>
            <p className="text-base md:text-lg text-black/80 max-w-xl font-sans leading-relaxed mb-8 font-normal">
              Track job applications, organize interview preparation sheets, monitor selection pipeline stages, and view real-time career analytics.
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
                SIGN IN TO YOUR PORTAL
              </Link>
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 opacity-10 text-[220px] font-black pointer-events-none select-none tracking-tighter">
            cooked?
          </div>
        </section>

        {/* Story Block 2: Lime Systems Panel */}
        <section className="rounded-3xl bg-[#dceeb1] text-black p-8 md:p-14 border border-black/5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-black text-white text-[10px] font-mono uppercase tracking-widest font-bold">
                SYSTEM MODULE 01
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                Precision Pipeline Tracking for Every Job Application.
              </h2>
              <p className="text-sm md:text-base text-black/80 font-sans leading-relaxed">
                Log online assessments, technical interviews, HR rounds, and selection offers with real-time state management. Never miss a interview date or deadline.
              </p>
              <ul className="space-y-2 pt-2 font-mono text-xs font-semibold text-black/90">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">✓</span>
                  Multi-stage pipeline status badges (OA, Technical, HR, Selected, Rejected)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">✓</span>
                  Salary package (LPA), location, and custom application notes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">✓</span>
                  Granular search, status filters, and sorting controls
                </li>
              </ul>
            </div>
            <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-black/10 shadow-sm space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1f1d3d] text-white flex items-center justify-center">
                    <CompanyIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Google Cloud</div>
                    <div className="text-xs font-mono text-gray-500">Software Engineer · 24 LPA</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#c8e6cd] text-emerald-950 text-[10px] font-mono font-bold uppercase">
                  SELECTED
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                    <CompanyIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Microsoft</div>
                    <div className="text-xs font-mono text-gray-500">SDE-1 · 18 LPA</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-950 text-[10px] font-mono font-bold uppercase">
                  HR INTERVIEW
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c5b0f4] text-black flex items-center justify-center">
                    <CompanyIcon className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Amazon</div>
                    <div className="text-xs font-mono text-gray-500">Cloud Support · 14 LPA</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-[10px] font-mono font-bold uppercase">
                  ASSESSMENT
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Story Block 3: Grid of Cream & Mint Story Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cream Card: Prep Resource Hub */}
          <div className="rounded-3xl bg-[#f4ecd6] text-black p-8 md:p-10 border border-black/5 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-2">
              <ResourceIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/60">MODULE 02</div>
            <h3 className="text-2xl font-bold tracking-tight">Curated Prep Resource Hub</h3>
            <p className="text-sm text-black/80 font-sans leading-relaxed">
              Access peer-contributed study sheets for Data Structures &amp; Algorithms, Aptitude, Core CS, System Design, and resume templates.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 font-mono text-[10px] font-bold">
              <span className="px-3 py-1 rounded-full bg-black text-white">DSA SHEETS</span>
              <span className="px-3 py-1 rounded-full bg-white text-black border border-black/10">CORE CS</span>
              <span className="px-3 py-1 rounded-full bg-white text-black border border-black/10">INTERVIEW EXP</span>
            </div>
          </div>

          {/* Mint Card: Admin Intelligence */}
          <div className="rounded-3xl bg-[#c8e6cd] text-black p-8 md:p-10 border border-black/5 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-2">
              <AnalyticsIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/60">MODULE 03</div>
            <h3 className="text-2xl font-bold tracking-tight">Institutional Placement Intelligence</h3>
            <p className="text-sm text-black/80 font-sans leading-relaxed">
              Comprehensive administrator control room featuring real-time offer conversion rates, student activity audit logs, and master application overrides.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 font-mono text-[10px] font-bold">
              <span className="px-3 py-1 rounded-full bg-black text-white">CONVERSION ANALYTICS</span>
              <span className="px-3 py-1 rounded-full bg-white text-black border border-black/10">STUDENT DIRECTORY</span>
            </div>
          </div>
        </section>

        {/* Story Block 4: Deep Indigo Navy Architecture Banner */}
        <section className="rounded-3xl bg-[#1f1d3d] text-white p-8 md:p-14 border border-white/10 shadow-sm">
          <div className="max-w-3xl space-y-6">
            <div className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-white text-[10px] font-mono uppercase tracking-widest font-bold border border-white/15">
              TECHNICAL ARCHITECTURE &amp; PERFORMANCE
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Engineered for Modern Placement Workflows.
            </h2>
            <p className="text-sm md:text-base text-gray-300 font-sans leading-relaxed">
              Built on Next.js 16 App Router, Node.js REST Services, JWT authentication, and the monochrome editorial design system token architecture.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-6 font-mono text-xs font-bold">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black hover:bg-gray-100 transition-all shadow-sm"
              >
                JOIN THE PLATFORM <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#e6e6e6] dark:border-gray-800 py-12 bg-white dark:bg-[#0c0b10]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold flex items-center justify-center text-[10px]">
              c?
            </div>
            <div>
              &copy; {new Date().getFullYear()} <strong className="text-black dark:text-white">cooked?</strong> Career &amp; Placement Platform.
            </div>
          </div>
          <div className="flex items-center gap-4 uppercase font-bold tracking-wider text-[10px]">
            <span>FIGMA SANS</span>
            <span>·</span>
            <span>JETBRAINS MONO</span>
            <span>·</span>
            <span>EDITORIAL SYSTEM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
