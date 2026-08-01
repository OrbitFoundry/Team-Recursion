'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { Input } from './Input';

import {
	AtSign as AtSignIcon,
	ChevronLeft as ChevronLeftIcon,
} from 'lucide-react';

const AppleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
		<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.67-.82 1.13-1.96.99-3.1-.98.04-2.17.65-2.87 1.47-.62.72-1.16 1.88-.99 3.01 1.09.08 2.21-.56 2.87-1.38z"/>
	</svg>
);

const GithubIcon = (props: React.ComponentProps<'svg'>) => (
	<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
		<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
	</svg>
);

export function AuthPage() {
	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 font-sans bg-white dark:bg-[#0f0e17] text-gray-900 dark:text-white">
			{/* Left Side Story Block Banner (Deep Indigo Navy Ground with Animated Floating Vector Paths) */}
			<div className="relative hidden h-full flex-col border-r border-gray-200/80 dark:border-gray-800/80 p-10 lg:flex bg-[#1f1d3d] text-white">
				<div className="from-[#1f1d3d] absolute inset-0 z-10 bg-gradient-to-t to-transparent opacity-80" />
				<div className="z-10 flex items-center gap-3">
					<div className="w-9 h-9 rounded-full bg-white text-black font-bold text-sm flex items-center justify-center tracking-tighter">
						TR
					</div>
					<div>
						<p className="text-xl font-bold tracking-tight">cooked?</p>
						<p className="text-[10px] font-mono uppercase tracking-widest text-gray-300">CAREER & PLACEMENT PORTAL</p>
					</div>
				</div>
				<div className="z-10 mt-auto max-w-lg">
					<blockquote className="space-y-3">
						<p className="text-2xl font-bold tracking-tight leading-snug">
							&ldquo;Streamlining institutional campus recruitment with precision tracking and automated student workflows.&rdquo;
						</p>
						<footer className="font-mono text-xs uppercase tracking-widest text-[#c5b0f4] font-bold">
							~ TEAM RECURSION CORE
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0 overflow-hidden opacity-40">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>

			{/* Right Side Auth Form Container */}
			<div className="relative flex min-h-screen flex-col justify-center p-6 md:p-12">
				<Button variant="ghost" className="absolute top-7 left-5 rounded-full font-mono text-xs uppercase font-bold" asChild>
					<a href="/">
						<ChevronLeftIcon className='size-4 me-2' />
						Home
					</a>
				</Button>
				<div className="mx-auto space-y-6 sm:w-sm w-full max-w-md">
					<div className="flex items-center gap-2.5 lg:hidden mb-2">
						<div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs flex items-center justify-center">
							TR
						</div>
						<p className="text-lg font-bold tracking-tight">Team Recursion</p>
					</div>
					<div className="flex flex-col space-y-1.5">
						<div className="text-[11px] font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">INSTITUTIONAL ACCESS</div>
						<h1 className="text-2xl font-extrabold tracking-tight dark:text-white">
							Sign In or Join Now!
						</h1>
						<p className="text-xs font-mono text-gray-500 dark:text-gray-400">
							Log in or create your placement portal account.
						</p>
					</div>
					<div className="space-y-2.5">
						<Button type="button" size="lg" className="w-full rounded-full font-mono text-xs uppercase font-bold bg-black text-white hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
							<GoogleIcon className='size-4 me-2' />
							Continue with Google
						</Button>
						<Button type="button" size="lg" className="w-full rounded-full font-mono text-xs uppercase font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-95 transition-all">
							<AppleIcon className='size-4 me-2' />
							Continue with Apple
						</Button>
						<Button type="button" size="lg" className="w-full rounded-full font-mono text-xs uppercase font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-95 transition-all">
							<GithubIcon className='size-4 me-2' />
							Continue with GitHub
						</Button>
					</div>

					<AuthSeparator />

					<form className="space-y-3.5">
						<p className="text-gray-500 dark:text-gray-400 text-start text-xs font-mono">
							Enter your institutional email address
						</p>
						<div className="relative h-max">
							<Input
								placeholder="student@university.edu"
								className="peer ps-9 rounded-xl font-mono text-xs"
								type="email"
							/>
							<div className="text-gray-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
								<AtSignIcon className="size-4" aria-hidden="true" />
							</div>
						</div>

						<Button type="button" className="w-full rounded-full font-mono text-xs font-bold uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02] active:scale-95 transition-all py-3">
							<span>Continue With Email</span>
						</Button>
					</form>
					<p className="text-gray-400 text-center mt-6 text-xs font-mono">
						By clicking continue, you agree to our{' '}
						<a
							href="#"
							className="text-black dark:text-white font-semibold underline underline-offset-4"
						>
							Terms of Service
						</a>{' '}
						and{' '}
						<a
							href="#"
							className="text-black dark:text-white font-semibold underline underline-offset-4"
						>
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</main>
	);
}

function FloatingPaths({ position }: { position: number }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		color: `rgba(197,176,244,${0.15 + i * 0.02})`,
		width: 0.5 + i * 0.03,
	}));

	return (
		<div className="pointer-events-none absolute inset-0">
			<svg
				className="h-full w-full text-[#c5b0f4]"
				viewBox="0 0 696 316"
				fill="none"
			>
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.15 + path.id * 0.02}
						initial={{ pathLength: 0.3, opacity: 0.6 }}
						animate={{
							pathLength: 1,
							opacity: [0.3, 0.6, 0.3],
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: 20 + Math.random() * 10,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</svg>
		</div>
	);
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
	</svg>
);

const AuthSeparator = () => {
	return (
		<div className="flex w-full items-center justify-center my-4">
			<div className="bg-gray-200 dark:bg-gray-800 h-px w-full" />
			<span className="text-gray-400 px-3 text-[11px] font-mono uppercase font-bold">OR</span>
			<div className="bg-gray-200 dark:bg-gray-800 h-px w-full" />
		</div>
	);
};
