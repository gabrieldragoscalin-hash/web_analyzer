"use client";

import { useState, use } from 'react'
import { signup, loginWithFacebook } from '../auth/actions'
import Link from 'next/link'
import Navbar from "../../components/navbar";

export default function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = use(searchParams)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden flex flex-col">

            {/* ⚡ Multi-layered premium ambient background glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/10 via-sky-400/8 to-transparent blur-3xl pointer-events-none rounded-full" />
            <div className="absolute bottom-12 right-12 w-[400px] h-[400px] bg-indigo-400/5 blur-3xl pointer-events-none rounded-full" />

            <Navbar user={null} />

            <div className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24 relative z-10">
                {/* ⚡ Frosted Glass Panel Container */}
                <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)]">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Account</h2>
                        <p className="mt-1 text-sm text-slate-500">Get access to extensive website visibility metrics</p>
                    </div>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {error && (
                            <p className="rounded-xl bg-red-50/80 backdrop-blur-sm p-3 text-sm font-medium text-red-600 border border-red-100">
                                {error}
                            </p>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1.5 block w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                placeholder="name@business.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                            <div className="relative mt-1.5">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full rounded-xl border border-slate-200/60 bg-white/50 pl-4 pr-12 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 selection:bg-transparent"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                            <div className="relative mt-1.5">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="block w-full rounded-xl border border-slate-200/60 bg-white/50 pl-4 pr-12 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 selection:bg-transparent"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            formAction={signup}
                            className="mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-colors hover:from-blue-700 hover:to-sky-600"
                        >
                            Register
                        </button>
                    </form>

                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200/60" /></div>
                        <span className="relative bg-white/0 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">or</span>
                    </div>

                    <form action={loginWithFacebook} className="flex flex-col">
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#166FE5] transition-colors flex items-center justify-center gap-2"
                        >
                            Continue with Facebook
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 decoration-transparent">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}