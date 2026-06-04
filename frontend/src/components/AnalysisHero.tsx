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
        <header className="pt-10 pb-10 px-4 max-w-6xl mx-auto text-center">
            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Free Web Analyzer
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-6 mb-4 bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">
                Is your website costing you customers?
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-6 max-w-2xl mx-auto">
                Get a free 60-second report that shows exactly what’s wrong and how to fix it.
            </p>

            <form
                onSubmit={onAnalyze}
                className="max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-slate-200/80 flex flex-col sm:flex-row gap-2"
            >
                <input
                    type="url"
                    required
                    placeholder="https://yourwebsite.com"
                    value={url}
                    onChange={(event) => onUrlChange(event.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
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
