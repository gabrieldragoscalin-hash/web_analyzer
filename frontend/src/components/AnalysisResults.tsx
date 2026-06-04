import type { FormEvent } from "react";

import type { AiReport, AnalysisResponse } from "./types";

interface AnalysisResultsProps {
    report: AnalysisResponse;
    aiReportData: AiReport | null;
    premiumLoading: boolean;
    showContactForm: boolean;
    contactEmail: string;
    contactPhone: string;
    contactSubmitted: boolean;
    onDownloadDetailedReport: () => void;
    onToggleContactForm: () => void;
    onContactEmailChange: (value: string) => void;
    onContactPhoneChange: (value: string) => void;
    onContactSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const formatIssueLabel = (issue: string) =>
    issue.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function AnalysisResults({
    report,
    aiReportData,
    premiumLoading,
    showContactForm,
    contactEmail,
    contactPhone,
    contactSubmitted,
    onDownloadDetailedReport,
    onToggleContactForm,
    onContactEmailChange,
    onContactPhoneChange,
    onContactSubmit,
}: AnalysisResultsProps) {
    return (
        <section className="max-w-7xl mx-auto px-4 pb-20 scroll-mt-6">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
                <article className="bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)]">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                        <div>
                            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Analysis Report For</h3>
                            <p className="text-sm font-semibold text-blue-600 break-all">{report.url}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Performance Score</span>
                            <p className={`text-3xl font-black ${report.score >= 70 ? "text-green-600" : report.score >= 40 ? "text-amber-500" : "text-red-500"}`}>
                                {report.score}/100
                            </p>
                        </div>
                    </div>

                    {aiReportData ? (
                        <div className="mb-8 bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                            <h4 className="font-bold text-blue-900 mb-2">📋 Executive Summary</h4>
                            <p className="text-slate-700 text-sm leading-relaxed mb-3">{aiReportData.summary}</p>
                            <p className="text-slate-600 text-xs italic">{aiReportData.explanation}</p>
                        </div>
                    ) : null}

                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-lg">Detected Issues & Fixes</h4>
                        {report.issues.length === 0 ? (
                            <p className="text-green-600 font-medium bg-green-50 p-4 rounded-xl">🎉 No critical issues found! Your website baseline looks solid.</p>
                        ) : (
                            report.issues.map((issue, index) => (
                                <div key={`${issue}-${index}`} className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-2">
                                    <div className="flex items-start gap-2.5 text-red-600 font-semibold text-sm">
                                        <span className="shrink-0 mt-0.5">❌</span>
                                        <p>{formatIssueLabel(issue)}</p>
                                    </div>
                                    <div className="flex items-start gap-2.5 text-green-700 font-medium text-sm pl-6 border-l-2 border-dashed border-slate-200 ml-3">
                                        <span className="shrink-0">✅ Fix:</span>
                                        <p>{report.fixes[index]}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {aiReportData?.business_impact ? (
                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <h4 className="font-bold text-red-900 text-sm uppercase tracking-wide mb-2">⚠️ Estimated Business Impact</h4>
                            <p className="text-slate-700 text-sm bg-red-50/40 p-4 rounded-xl border border-red-100/60 leading-relaxed">
                                {aiReportData.business_impact}
                            </p>
                        </div>
                    ) : null}
                </article>

                <aside className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)] sticky top-20 backdrop-blur">
                    <h3 className="text-lg font-bold text-slate-900">More options</h3>
                    <p className="mt-1 text-sm text-slate-600">Choose the next step after your free report.</p>
                    <div className="mt-5 space-y-4">
                        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
                            <p className="text-sm font-semibold text-amber-900">1. Premium report</p>
                            <p className="text-xs text-amber-800 mt-1">A simple PDF with clear fixes and step-by-step explanations.</p>
                            <button
                                type="button"
                                onClick={onDownloadDetailedReport}
                                disabled={premiumLoading || !report}
                                className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {premiumLoading ? "Generating PDF..." : "Get your detailed report — $12.99"}
                            </button>
                        </div>

                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
                            <p className="text-sm font-semibold text-blue-900">2. Redesign your homepage</p>
                            <p className="text-xs text-blue-800 mt-1">A done-for-you homepage improvement to help visitors trust your business faster.</p>
                            <a
                                href="#"
                                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                            >
                                Get a redesigned homepage for $39.99
                            </a>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                            <p className="text-sm font-semibold text-slate-900">3. Hire me to improve it</p>
                            <p className="text-xs text-slate-600 mt-1">Tell me how to reach you and I’ll follow up within 24 hours.</p>
                            <button
                                type="button"
                                onClick={onToggleContactForm}
                                className="mt-3 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200"
                            >
                                Hire me to get it
                            </button>
                        </div>

                        {showContactForm ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <h4 className="text-sm font-semibold text-slate-800">Let’s talk about your website</h4>
                                <p className="text-xs text-slate-600 mt-1">Prices are discussed directly for every customer’s needs.</p>
                                <form onSubmit={onContactSubmit} className="mt-4 space-y-3">
                                    <input
                                        type="email"
                                        required
                                        placeholder="Email address"
                                        value={contactEmail}
                                        onChange={(event) => onContactEmailChange(event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-blue-500"
                                    />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Phone number"
                                        value={contactPhone}
                                        onChange={(event) => onContactPhoneChange(event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 focus:border-blue-500"
                                    />
                                    <button type="submit" className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                                        Send request
                                    </button>
                                </form>
                                {contactSubmitted ? (
                                    <p className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">Expect an email in the next 24 hours.</p>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </aside>
            </div>
        </section>
    );
}
