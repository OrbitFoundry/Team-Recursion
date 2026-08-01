"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { CookedBrandIcon } from "@/components/ui/Icons";

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
      .catch(() => {
        // Fallback silently to CSS glass gradient if shader fails to load
      });
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
    <div className="w-full h-full bg-gradient-to-br from-[#1f1d3d] via-black to-[#0f0e17] opacity-90" />
  );
}

const formFields = [
  {
    label: "First name",
    value: "Gaurav",
    type: "text",
    placeholder: "First name",
  },
  { label: "Last name", value: "Khandelwal", type: "text", placeholder: "Last name" },
];

const termsText = (
  <>
    By creating an account, you agree to our{" "}
    <a
      href="#"
      className="font-medium text-black underline underline-offset-2 hover:opacity-80 dark:text-white"
    >
      Terms of Service
    </a>{" "}
    and{" "}
    <a
      href="#"
      className="font-medium text-black underline underline-offset-2 hover:opacity-80 dark:text-white"
    >
      Privacy Policy
    </a>
  </>
);

export default function AuthSectionThree() {
  return (
    <section className="h-screen w-screen overflow-hidden bg-white p-3 lg:p-5 text-black antialiased font-sans dark:bg-[#0c0b10] dark:text-white selection:bg-[#c5b0f4]">
      <div className="grid h-full w-full gap-4 lg:gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        {/* Left Side - SignUp Form */}
        <div className="flex h-full flex-col justify-center rounded-3xl border border-gray-200/80 bg-white px-6 py-6 dark:border-gray-800/80 dark:bg-[#161522] lg:px-12 lg:py-8 shadow-sm relative overflow-hidden overflow-y-auto">
          {/* Top Accent Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#c5b0f4]" />

          <div className="mx-auto w-full max-w-[420px]">
            <div className="flex items-center gap-3 mb-5">
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
                Create an account
              </h1>
              <p className="mt-1 text-xs font-mono text-gray-500 dark:text-gray-400">
                Join the platform to track job applications, interviews &amp; prep resources.
              </p>
            </div>

            <form className="mt-5 space-y-3 font-sans">
              <div className="grid gap-3 sm:grid-cols-2">
                {formFields.map((field) => (
                  <InputField
                    key={field.label}
                    label={field.label}
                    value={field.value}
                    placeholder={field.placeholder}
                    type={field.type}
                  />
                ))}
              </div>

              <InputField
                label="Email address"
                value="gaurav@example.com"
                placeholder="email@example.com"
                type="email"
              />

              <InputField
                label="Password"
                value="*************"
                placeholder="Enter password"
                type="password"
              />

              <div className="space-y-2 pt-1 text-xs leading-5 text-gray-600 dark:text-gray-400 sm:text-[12px]">
                <CheckboxLine>
                  I want to receive placement deadline updates &amp; application reminders.
                </CheckboxLine>
                <CheckboxLine>{termsText}</CheckboxLine>
              </div>

              <button
                type="submit"
                className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-black text-xs font-mono font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black shadow-sm"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Marketing Testimonial and Placement Portal Mockup */}
        <div className="relative hidden lg:flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-[#1f1d3d] p-8 text-white dark:bg-[#161522] xl:p-12 border border-white/10 shadow-sm">
          {/* Background Shader */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <SafeFlutedGlass />
          </div>

          <div className="relative z-10 h-full w-full flex flex-col justify-between">
            <div className="max-w-[440px] pt-4">
              <motion.div
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3.5"
              >
                <div className="w-9 h-9 rounded-full bg-[#c5b0f4] text-black font-extrabold flex items-center justify-center text-xs border border-white/30 shrink-0">
                  C
                </div>
                <div>
                  <div className="font-bold leading-tight text-white text-sm font-sans">
                    Charlotte Vance
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                    SWE Candidate · Placed at Stripe
                  </div>
                </div>
              </motion.div>
              <motion.blockquote
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-5 text-xl font-bold leading-snug tracking-tight text-white xl:text-2xl font-sans"
              >
                “cooked? simplified my placement prep. Tracked 40+ applications and landed my dream offer.”
              </motion.blockquote>
            </div>

            <div className="w-full overflow-hidden rounded-2xl border border-white/15 bg-black/70 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0b10]">
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/60 px-4 py-2.5 select-none">
                  <div className="size-2 rounded-full bg-rose-500/80" />
                  <div className="size-2 rounded-full bg-amber-500/80" />
                  <div className="size-2 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-[9px] font-mono tracking-widest text-white/50 uppercase font-bold">
                    cooked.portal/dashboard
                  </span>
                </div>
                <div className="p-4 bg-[#0c0b10] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#c5b0f4] font-bold">STUDENT DASHBOARD</div>
                      <div className="text-sm font-bold text-white font-sans">Live Application Pipeline</div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#c8e6cd] text-emerald-950 text-[9px] font-mono font-bold rounded-full uppercase">
                      4 Offers
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

function InputField({
  label,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
}) {
  const [val, setVal] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-1 text-left w-full font-sans">
      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative flex h-10 items-center rounded-2xl border border-gray-200 dark:border-gray-800 bg-white px-3.5 dark:bg-gray-900 focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white transition-all">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={val}
          onFocus={() => {
            if (!isEditing) {
              setVal("");
              setIsEditing(true);
            }
          }}
          onChange={(e) => {
            setVal(e.target.value);
            setIsEditing(true);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs sm:text-sm text-black outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500 font-sans"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
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
    <label className="flex items-start gap-2.5 cursor-pointer">
      <span className="relative mt-0.5 size-4 shrink-0">
        <input
          type="checkbox"
          className="peer size-full cursor-pointer appearance-none rounded-md border border-gray-300 bg-white checked:border-black checked:bg-black dark:border-gray-700 dark:bg-gray-900 dark:checked:border-white dark:checked:bg-white transition-colors"
        />
        <svg
          viewBox="0 0 12 12"
          className="pointer-events-none absolute inset-0 hidden size-full p-0.5 text-white peer-checked:block dark:text-black"
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
