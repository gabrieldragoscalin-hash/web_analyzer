import { signup, loginWithFacebook } from '../auth/actions'
import Link from 'next/link'
import Navbar from "../../components/navbar";

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
            <Navbar user={null} />

            <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.35)]">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Account</h2>
                        <p className="mt-1 text-sm text-slate-500">Get access to extensive website visibility metrics</p>
                    </div>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {error && (
                            <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100">
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
                                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                placeholder="name@business.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            formAction={signup}
                            className="mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-colors hover:from-blue-700 hover:to-sky-600"
                        >
                            Register
                        </button>
                    </form>

                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                        <span className="relative bg-white px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">or</span>
                    </div>

                    {/* Facebook OAuth */}
                    <form action={loginWithFacebook} style={{ display: 'flex', flexDirection: 'column' }}>
                        <button
                            type="submit"
                            className="rounded-xl bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#166FE5] transition-colors flex items-center justify-center gap-2"
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