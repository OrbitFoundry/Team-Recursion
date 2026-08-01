"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

// Safe wrapper for WebGL shader to prevent crashes on non-WebGL environments
function SafeFlutedGlass() {
  const [ShaderComponent, setShaderComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import("@paper-design/shaders-react")
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

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0e0e11] via-[#08080a] to-[#040405] opacity-95" />
  );
}

export default function AuthSectionThree() {
  return (
    <section className="min-h-screen bg-[#09090b] p-4 md:p-8 text-white antialiased font-sans flex items-center justify-center">
      <div className="grid w-full max-w-7xl grid-cols-1 lg:grid-cols-2 gap-6 min-h-[720px]">
        {/* Left Side - SignUp Form */}
        <div className="relative flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-[#121215] p-8 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
          {/* Floating Top Controls Toolbar */}
          <div className="flex items-center justify-between mb-6 select-none">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#1c1c21] border border-zinc-800 text-zinc-400 text-xs">
              <button type="button" className="p-1.5 hover:text-white transition-colors rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <button type="button" className="p-1.5 hover:text-white transition-colors rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              </button>
              <button type="button" className="p-1.5 hover:text-white transition-colors rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <Link href="/" className="text-xs font-mono tracking-widest text-zinc-500 hover:text-white uppercase font-semibold transition-colors">
              cooked?
            </Link>
          </div>

          <div className="mx-auto w-full max-w-[420px] my-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
                Create an account
              </h1>
            </div>

            {/* Social Signup Buttons */}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-[#1c1c21] px-4 text-xs font-medium text-white transition-all hover:bg-zinc-800 shadow-sm"
              >
                <GoogleIcon />
                <span className="whitespace-nowrap">Sign up with Google</span>
              </button>
              <button
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-[#1c1c21] px-4 text-xs font-medium text-white transition-all hover:bg-zinc-800 shadow-sm"
              >
                <AppleIcon />
                <span className="whitespace-nowrap">Sign up with Apple</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-600">
              <div className="h-px flex-1 bg-zinc-800" />
              or
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            <form className="space-y-4 font-sans" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="First name"
                  value="Harshit"
                  placeholder="First name"
                  type="text"
                />
                <InputField
                  label="Last name"
                  value="Sharma"
                  placeholder="Last name"
                  type="text"
                />
              </div>

              <InputField
                label="Email"
                value="harshitlog@gmail.com"
                placeholder="email@example.com"
                type="email"
              />

              <InputField
                label="Password"
                value="••••••••••••"
                placeholder="Enter password"
                type="password"
              />

              <div className="space-y-3 pt-1 text-xs leading-normal text-zinc-400">
                <CheckboxLine>
                  I don&apos;t want to receive emails about Postdrips feature updates and best practices.
                </CheckboxLine>
                <CheckboxLine>
                  By creating an account, you agree to our{" "}
                  <a href="#" className="font-medium text-white underline underline-offset-2 hover:opacity-80">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-medium text-white underline underline-offset-2 hover:opacity-80">
                    Privacy Policy
                  </a>
                </CheckboxLine>
              </div>

              <button
                type="submit"
                className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-black transition-all hover:bg-zinc-200 active:scale-[0.99] shadow-md"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-xs text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-medium underline hover:opacity-80">
              Sign in
            </Link>
          </div>
        </div>

        {/* Right Side - Testimonial & Mockup Showcase Card */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#08080a] p-8 sm:p-10 lg:p-12 text-white border border-zinc-800/80 shadow-2xl min-h-[640px]">
          {/* Background Shader Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
            <SafeFlutedGlass />
          </div>

          <div className="relative z-10 space-y-8 max-w-[480px]">
            {/* Author Profile */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Charlotte"
                className="size-10 rounded-full object-cover border border-white/20 shadow-sm"
              />
              <div>
                <div className="font-semibold text-sm text-white leading-snug">
                  Charlotte
                </div>
                <div className="text-xs text-zinc-400">
                  Design Engineer
                </div>
              </div>
            </motion.div>

            {/* Testimonial Quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-2xl sm:text-3xl lg:text-[32px] font-light leading-snug tracking-tight text-zinc-100"
            >
              “Every block had the restraint and polish we usually spend weeks refining.”
            </motion.blockquote>
          </div>

          {/* Bottom Browser Mockup Container */}
          <div className="relative z-10 mt-8 w-full translate-y-6 sm:translate-y-8 rounded-2xl border border-white/10 bg-[#0d0d10] p-1.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#09090b]">
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#121215] px-3.5 py-2.5 select-none">
                <div className="size-2.5 rounded-full bg-[#ff5f56]" />
                <div className="size-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="size-2.5 rounded-full bg-[#27c93f]" />
                <span className="mx-auto text-[11px] font-mono text-zinc-400 font-normal">
                  solaceui.com/dashboard
                </span>
              </div>

              {/* Dashboard Content Mockup */}
              <div className="p-4 sm:p-5 bg-[#09090b] text-zinc-300 font-sans space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Inbox</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">128</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-medium">All mail</span>
                    <span>Unread</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#141418] border border-zinc-800/60 flex items-start justify-between">
                    <div>
                      <div className="font-medium text-white">William Smith</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">Meeting Tomorrow</div>
                      <div className="text-[10px] text-zinc-500 mt-1 line-clamp-1">Hi, let&apos;s have a meeting tomorrow to discuss the project details...</div>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 shrink-0">4 months ago</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#141418]/60 border border-zinc-800/40 flex items-start justify-between">
                    <div>
                      <div className="font-medium text-zinc-300">Alice Smith</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">Re: Project Update</div>
                      <div className="text-[10px] text-zinc-500 mt-1 line-clamp-1">Thank you for the update. It looks great!</div>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 shrink-0">6 months ago</span>
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

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  name,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [val, setVal] = useState(value);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 text-left w-full font-sans">
      <label className="text-xs font-medium text-zinc-300 block">
        {label}
      </label>
      <div className="relative flex h-11 items-center rounded-xl border border-zinc-800 bg-[#1c1c21] px-3.5 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 transition-all">
        <input
          name={name}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={onChange ? value : val}
          onChange={onChange || ((e) => setVal(e.target.value))}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500 font-sans"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-zinc-500 hover:text-white cursor-pointer transition-colors"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function CheckboxLine({ children }: { children: ReactNode }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none">
      <span className="relative mt-0.5 size-4 shrink-0">
        <input
          type="checkbox"
          className="peer size-full cursor-pointer appearance-none rounded-md border border-zinc-700 bg-[#1c1c21] checked:border-white checked:bg-white transition-colors"
        />
        <svg
          viewBox="0 0 12 12"
          className="pointer-events-none absolute inset-0 hidden size-full p-0.5 text-black peer-checked:block"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 6.2 5 8.1 9 3.9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EB4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
    </svg>
  );
}
