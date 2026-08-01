'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
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

  return (
    <section className="h-screen w-screen overflow-hidden bg-white p-3 lg:p-5 text-black antialiased font-sans dark:bg-[#0c0b10] dark:text-white selection:bg-[#c5b0f4]">
      <div className="grid h-full w-full gap-4 lg:gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left Side - Login Form */}
        <div className="flex h-full flex-col justify-center rounded-3xl border border-gray-200/80 bg-white px-6 py-8 dark:border-gray-800/80 dark:bg-[#161522] lg:px-12 lg:py-10 shadow-sm relative overflow-hidden overflow-y-auto">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c5b0f4]" />

          <div className="mx-auto w-full max-w-[420px]">
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
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
                Sign In to Your Account
              </h1>
              <p className="mt-1.5 text-xs font-mono text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-bold text-black dark:text-white underline hover:opacity-80">
                  Sign up free
                </Link>
              </p>
            </div>

            <form className="mt-6 space-y-4 font-sans" onSubmit={handleSubmit}>
              {errors.general && (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-mono p-3.5 rounded-2xl">
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
                className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-black text-xs font-mono font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-black shadow-sm"
              >
                {isLoading ? 'SIGNING IN…' : 'SIGN IN'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Marketing Glass Showcase */}
        <div className="relative hidden lg:flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-[#1f1d3d] p-8 text-white dark:bg-[#161522] xl:p-12 border border-white/10 shadow-sm">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <SafeFlutedGlass />
          </div>

          <div className="relative z-10 h-full w-full flex flex-col justify-between">
            <div className="max-w-[440px] pt-4">
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3.5"
              >
                <div className="w-9 h-9 rounded-full bg-[#c5b0f4] text-black font-extrabold flex items-center justify-center text-xs border border-white/30 shrink-0">
                  G
                </div>
                <div>
                  <div className="font-bold leading-tight text-white text-sm font-sans">
                    Gaurav Khandelwal
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                    Lead Candidate · Placed
                  </div>
                </div>
              </motion.div>
              <motion.blockquote
                initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 text-xl font-bold leading-snug tracking-tight text-white xl:text-2xl font-sans"
              >
                “cooked? gave us total clarity over company shortlists and interview rounds.”
              </motion.blockquote>
            </div>

            <div className="w-full overflow-hidden rounded-2xl border border-white/15 bg-black/70 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0b10]">
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/60 px-4 py-2.5 select-none">
                  <div className="size-2 rounded-full bg-rose-500/80" />
                  <div className="size-2 rounded-full bg-amber-500/80" />
                  <div className="size-2 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-[9px] font-mono tracking-widest text-white/50 uppercase font-bold">
                    cooked.portal/login
                  </span>
                </div>
                <div className="p-4 bg-[#0c0b10] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#c5b0f4] font-bold">LIVE DASHBOARD</div>
                      <div className="text-sm font-bold text-white font-sans">Applications &amp; Resources</div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#c8e6cd] text-emerald-950 text-[9px] font-mono font-bold rounded-full uppercase">
                      ACTIVE SESSION
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#dceeb1] text-black">
                      <div className="text-lg font-extrabold">24</div>
                      <div className="text-[9px] font-mono font-bold uppercase opacity-80">APPLIED</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#f4ecd6] text-black">
                      <div className="text-lg font-extrabold">8</div>
                      <div className="text-[9px] font-mono font-bold uppercase opacity-80">INTERVIEWS</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#c8e6cd] text-black">
                      <div className="text-lg font-extrabold">4</div>
                      <div className="text-[9px] font-mono font-bold uppercase opacity-80">OFFERS</div>
                    </div>
                  </div>
                </div>
              </div>
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
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-[#0c0b10]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
