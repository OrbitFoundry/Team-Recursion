'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { redirectToGoogleAuth } from '@/lib/auth-utils';
import { CookedBrandIcon } from '@/components/ui/Icons';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

function SafeFlutedGlass() {
  const [ShaderComponent, setShaderComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('@paper-design/shaders-react')
      .then((mod) => {
        if (mod && mod.FlutedGlass) {
          setShaderComponent(() => mod.FlutedGlass);
        }
      })
      .catch(() => {});
  }, []);

  if (ShaderComponent) {
    return (
      <ShaderComponent
        size={0.89}
        shape="lines"
        angle={0}
        distortionShape="prism"
        distortion={0.5}
        shift={0}
        blur={0}
        edges={0.25}
        stretch={0}
        scale={1.11}
        fit="cover"
        highlights={0.1}
        shadows={0.2}
        grainMixer={0.1}
        grainOverlay={0.1}
        colorBack="#00000000"
        colorHighlight="#FFFFFF"
        colorShadow="#000000"
        className="w-full h-full bg-transparent"
      />
    );
  }

  return <div className="w-full h-full bg-gradient-to-br from-[#1f1d3d] via-black to-[#0f0e17] opacity-90" />;
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setErrors({ general: 'Authentication failed. Please check your credentials.' });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined, general: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (error: unknown) {
      const apiError = error as { 
        response?: { 
          data?: { error?: { message: string } };
          status?: number;
        }; 
        message?: string;
      };
      
      if (apiError.response?.status === 429) {
        const errorMessage = apiError.response?.data?.error?.message || 'Too many attempts. Please try again later.';
        setErrors({ general: errorMessage });
      } else {
        const errorMessage = apiError.response?.data?.error?.message || apiError.message || 'Login failed. Check your credentials.';
        if (errorMessage.toLowerCase().includes('email')) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.toLowerCase().includes('password')) {
          setErrors({ password: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    redirectToGoogleAuth();
  };

  return (
    <section className="min-h-screen bg-white p-3 md:p-6 text-black antialiased font-sans dark:bg-[#0c0b10] dark:text-white selection:bg-[#c5b0f4]">
      <div className="grid min-h-[calc(100vh-3rem)] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        {/* Left Side - Login Form */}
        <div className="flex min-h-[720px] items-center justify-center rounded-3xl border border-gray-200/80 bg-white px-6 py-12 dark:border-gray-800/80 dark:bg-[#161522] lg:min-h-0 lg:px-14 lg:py-20 xl:px-20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#c5b0f4]" />

          <div className="mx-auto w-full max-w-[460px]">
            {/* Header Brand */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 bg-black dark:bg-white flex items-center justify-center shrink-0 shadow-sm">
                <CookedBrandIcon className="w-5 h-5 text-white dark:text-black" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight block leading-none font-sans">cooked?</span>
                <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">CAREER &amp; PLACEMENT PORTAL</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-black dark:text-white">
                Sign In to Your Account
              </h1>
              <p className="mt-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-bold text-black dark:text-white underline hover:opacity-80">
                  Sign up free
                </Link>
              </p>
            </div>

            {/* Social Auth */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white px-4 text-xs font-mono font-bold uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-white dark:hover:text-black shadow-sm"
              >
                <GoogleIcon />
                <span className="whitespace-nowrap">Sign in with Google</span>
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white px-4 text-xs font-mono font-bold uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-white dark:hover:text-black shadow-sm"
              >
                <AppleIcon />
                <span className="whitespace-nowrap">Sign in with Apple</span>
              </button>
            </div>

            <div className="my-6 flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              OR EMAIL
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <form className="space-y-4 font-sans" onSubmit={handleSubmit}>
              {errors.general && (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-mono p-4 rounded-2xl">
                  {errors.general}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5 text-left w-full font-sans">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  EMAIL ADDRESS
                </label>
                <div className="relative flex h-11 items-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-white px-3.5 dark:bg-gray-900 focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition-all">
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500 font-sans"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 font-mono mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left w-full font-sans">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    PASSWORD
                  </label>
                  <Link href="/forgot-password" className="text-[11px] font-mono text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex h-11 items-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-white px-3.5 dark:bg-gray-900 focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition-all">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500 font-mono mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-black text-xs font-mono font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-black shadow-sm"
              >
                {isLoading ? 'SIGNING IN…' : 'SIGN IN'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Marketing Glass Showcase */}
        <div className="relative flex min-h-[720px] flex-col overflow-hidden rounded-3xl bg-[#1f1d3d] p-8 text-white dark:bg-[#161522] sm:p-12 lg:min-h-0 lg:p-16 border border-white/10 shadow-sm">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <SafeFlutedGlass />
          </div>

          <div className="relative z-10 h-full w-full">
            <div className="max-w-[460px] lg:pt-12">
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#c5b0f4] text-black font-extrabold flex items-center justify-center text-sm border border-white/30 shrink-0">
                  G
                </div>
                <div>
                  <div className="font-bold leading-tight text-white font-sans">
                    Gaurav Khandelwal
                  </div>
                  <div className="mt-0.5 text-xs font-mono uppercase tracking-wider text-white/70">
                    Lead Candidate · Placed
                  </div>
                </div>
              </motion.div>
              <motion.blockquote
                initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 0.8,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-7 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[34px] font-sans"
              >
                “cooked? gave us total clarity over company shortlists and interview rounds.”
              </motion.blockquote>
            </div>

            <div className="mt-10 w-full translate-y-[24%] overflow-hidden rounded-2xl border border-white/15 bg-black/70 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:translate-y-[22%] lg:absolute lg:left-[12%] lg:-bottom-28 lg:mt-0 lg:w-[105%] lg:max-w-none lg:origin-bottom-left lg:translate-y-0 lg:-rotate-3 xl:left-[14%] xl:-bottom-[150px] xl:w-[108%] 2xl:-bottom-[170px] 2xl:w-[112%]">
              <motion.div
                initial={{ opacity: 0, y: 72, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: 1,
                  delay: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0b10]"
              >
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/60 px-4 py-3 select-none">
                  <div className="size-2.5 rounded-full bg-rose-500/80" />
                  <div className="size-2.5 rounded-full bg-amber-500/80" />
                  <div className="size-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-4 text-[9px] font-mono tracking-widest text-white/50 uppercase font-bold">
                    cooked.portal/login
                  </span>
                </div>
                <div className="p-6 bg-[#0c0b10] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-widest text-[#c5b0f4] font-bold">LIVE DASHBOARD</div>
                      <div className="text-lg font-bold text-white font-sans">Applications &amp; Resources</div>
                    </div>
                    <span className="px-3 py-1 bg-[#c8e6cd] text-emerald-950 text-[10px] font-mono font-bold rounded-full uppercase">
                      ACTIVE SESSION
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-2xl bg-[#dceeb1] text-black">
                      <div className="text-xl font-extrabold">24</div>
                      <div className="text-[10px] font-mono font-bold uppercase opacity-80">APPLIED</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#f4ecd6] text-black">
                      <div className="text-xl font-extrabold">8</div>
                      <div className="text-[10px] font-mono font-bold uppercase opacity-80">INTERVIEWS</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#c8e6cd] text-black">
                      <div className="text-xl font-extrabold">4</div>
                      <div className="text-[10px] font-mono font-bold uppercase opacity-80">OFFERS</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0c0b10]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" className="shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EB4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
    </svg>
  );
}
