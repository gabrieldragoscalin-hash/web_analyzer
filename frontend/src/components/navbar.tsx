"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

interface NavbarProps {
    user: any;
    onLogout?: () => Promise<void>;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
    const router = useRouter();

    // Setup client-side supabase fallback only used if a custom onLogout isn't passed down
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogoutClick = async () => {
        if (onLogout) {
            await onLogout();
        } else {
            // Safe fallback logic for static pages
            await supabase.auth.signOut();
            router.refresh();
            router.push("/");
        }
    };

    return (
        <nav className="sticky top-0 z-30 border-b border-white/20 bg-white/40 backdrop-blur-md transition-all">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 no-underline">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">⚡</div>
                        <div>
                            <p className="text-sm font-semibold tracking-[0.22em] text-blue-700 uppercase">Web Analyzer</p>
                            <p className="text-xs text-slate-500">Web health for your business</p>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    {user ? (
                        <button
                            onClick={handleLogoutClick}
                            className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">Login</button>
                            </Link>
                            <Link href="/register">
                                <button className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-sky-600">Register</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}