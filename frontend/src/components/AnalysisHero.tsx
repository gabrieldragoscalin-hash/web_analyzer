import type { FormEvent } from "react";

interface AnalysisHeroProps {
    url: string;
    loading: boolean;
    error: string;
    onUrlChange: (value: string) => void;
    onAnalyze: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AnalysisHero({
    url,
    loading,
    error,
    onUrlChange,
    onAnalyze,
}: AnalysisHeroProps) {
    return (
        <header className="pt-10 pb-12 px-4 max-w-6xl mx-auto text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-sm font-semibold text-blue-700 shadow-[0_12px_30px_-18px_rgba(37,99,235,0.45)] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Free Web Analyzer
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-6 mb-4 bg-gradient-to-r from-slate-900 via-blue-800 to-sky-600 bg-clip-text text-transparent drop-shadow-sm">
                Is your website costing you customers?
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed text-balance">
                Get a fast, clear report on speed, trust, and layout issues — then fix what matters most.
            </p>

            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-white/90 px-3 py-1 shadow-sm border border-slate-200">⚡ 60-second analysis</span>
                <span className="rounded-full bg-white/90 px-3 py-1 shadow-sm border border-slate-200">📱 Mobile friendly</span>
            </div>

            <form
                onSubmit={onAnalyze}
                className="max-w-2xl mx-auto rounded-[28px] border border-slate-200 bg-white/95 p-2 shadow-[0_25px_60px_-28px_rgba(15,23,42,0.45)] backdrop-blur flex flex-col sm:flex-row gap-2"
            >
                <input
                    type="url"
                    required
                    placeholder="https://yourwebsite.com"
                    value={url}
                    onChange={(event) => onUrlChange(event.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 via-blue-700 to-sky-500 hover:from-blue-700 hover:via-blue-800 hover:to-sky-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-[0_18px_30px_-14px_rgba(37,99,235,0.45)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Analyzing...
                        </>
                    ) : (
                        "👉 Check my website"
                    )}
                </button>
            </form>

            {error ? (
                <p className="text-red-600 font-medium mt-4 bg-red-50 py-2 px-4 rounded-lg inline-block border border-red-100">
                    ❌ {error}
                </p>
            ) : null}
        </header>
    );
}
