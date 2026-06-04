"use client";
import React, { useState, FormEvent } from "react";

// 1. Define the interface matching your Python "WebsiteRequest" model
interface AnalysisRequest {
  url: string;
}

// 2. Define the expected shape of the AI JSON output from Groq
interface AiReport {
  summary: string;
  explanation: string;
  priority_fixes: string[] | string;
  business_impact: string;
}

// 3. Define the main payload returned by your FastAPI backend
interface AnalysisResponse {
  url: string;
  score: number;
  issues: string[];
  fixes: string[];
  ai_report: string | AiReport; // Can be a raw string or pre-parsed object
}

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [premiumLoading, setPremiumLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [report, setReport] = useState<AnalysisResponse | null>(null);

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const requestBody: AnalysisRequest = { url: url };

      const response = await fetch("https://web-analyzer-backend-622w.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong.");
      }

      const data: AnalysisResponse = await response.json();

      // Safe parsing logic for the AI payload
      let parsedAiReport: AiReport | string = data.ai_report;
      if (typeof data.ai_report === "string") {
        try {
          parsedAiReport = JSON.parse(data.ai_report) as AiReport;
        } catch (e) {
          console.error("Failed to parse AI report string", e);
        }
      }

      setReport({ ...data, ai_report: parsedAiReport });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Helper type guard to make rendering the typed AI block clean
  const handleDownloadDetailedReport = async () => {
    if (!url) return;

    setPremiumLoading(true);
    setError("");

    try {
      const response = await fetch("https://web-analyzer-backend-622w.onrender.com/generate-detailed-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong while generating the detailed report.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "premium-website-report.pdf";
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setPremiumLoading(false);
    }
  };

  const getAiReportData = (aiReport: string | AiReport | undefined): AiReport | null => {
    if (aiReport && typeof aiReport === "object") {
      return aiReport as AiReport;
    }
    return null;
  };

  const aiReportData = getAiReportData(report?.ai_report);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">

      {/* HERO SECTION */}
      <header className="py-20 px-4 max-w-4xl mx-auto text-center">
        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Free Web Analyzer
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-6 mb-4 bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">
          Is your website costing you customers?
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Get a free 60-second report that shows exactly what’s wrong and how to fix it.
        </p>

        {/* INPUT FORM */}
        <form onSubmit={handleAnalyze} className="max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-slate-200/80 flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            required
            placeholder="https://yourwebsite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
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

        {error && (
          <p className="text-red-600 font-medium mt-4 bg-red-50 py-2 px-4 rounded-lg inline-block border border-red-100">
            ❌ {error}
          </p>
        )}
      </header>

      {/* DYNAMIC RESULTS DISPLAY */}
      {report && (
        <section className="max-w-3xl mx-auto px-4 pb-20 scroll-mt-6">
          <div className="bg-gradient-to-b from-white to-slate-50 border-2 border-blue-500 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Analysis Report For</h3>
                <p className="text-sm font-semibold text-blue-600 break-all">{report.url}</p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Performance Score</span>
                <p className={`text-3xl font-black ${report.score >= 70 ? 'text-green-600' : report.score >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
                  {report.score}/100
                </p>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">Want a deeper PDF with real fixes, code examples, and business-friendly explanations?</p>
              <button
                type="button"
                onClick={handleDownloadDetailedReport}
                disabled={premiumLoading || !report}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {premiumLoading ? "Generating PDF..." : "Get a more detailed report with real fixes — $12.99"}
              </button>
            </div>

            {/* AI Summary Block */}
            {aiReportData && (
              <div className="mb-8 bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">📋 Executive Summary</h4>
                <p className="text-slate-700 text-sm leading-relaxed mb-3">{aiReportData.summary}</p>
                <p className="text-slate-600 text-xs italic">{aiReportData.explanation}</p>
              </div>
            )}

            {/* Issues & Fixes Lists */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-lg">Detected Issues & Fixes</h4>
              {report.issues.length === 0 ? (
                <p className="text-green-600 font-medium bg-green-50 p-4 rounded-xl">🎉 No critical issues found! Your website baseline looks solid.</p>
              ) : (
                report.issues.map((issue, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
                    <div className="flex items-start gap-2.5 text-red-600 font-semibold text-sm">
                      <span className="shrink-0 mt-0.5">❌</span>
                      <p className="capitalize">{issue.replace(/_/g, " ")}</p>
                    </div>
                    <div className="flex items-start gap-2.5 text-green-700 font-medium text-sm pl-6 border-l-2 border-dashed border-slate-200 ml-3">
                      <span className="shrink-0">✅ Fix:</span>
                      <p>{report.fixes[idx]}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* AI Business Impact Block */}
            {aiReportData?.business_impact && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h4 className="font-bold text-red-900 text-sm uppercase tracking-wide mb-2">⚠️ Estimated Business Impact</h4>
                <p className="text-slate-700 text-sm bg-red-50/40 p-4 rounded-xl border border-red-100/60 leading-relaxed">
                  {aiReportData.business_impact}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PROBLEM SECTION */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Slow websites lose customers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <div className="text-3xl mb-4">⏳</div>
              <h3 className="font-semibold text-xl mb-2">Slow Loading Speed</h3>
              <p className="text-slate-400 text-sm">Users bounce within 3 seconds if pages lag. Every extra millisecond costs potential checkouts.</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-semibold text-xl mb-2">Bad Mobile Design</h3>
              <p className="text-slate-400 text-sm">Unoptimized mobile layouts instantly kill trust. If it looks broken on a phone, buyers leave.</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
              <div className="text-3xl mb-4">🧩</div>
              <h3 className="font-semibold text-xl mb-2">Confusing Layouts</h3>
              <p className="text-slate-400 text-sm">Vague messaging or hidden buttons reduce client bookings and lower overall leads.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-blue-200">1</div>
            <h3 className="font-semibold text-lg">Enter Your URL</h3>
            <p className="text-slate-500 text-sm">Drop your business page link right into our smart lookup bar above.</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-blue-200">2</div>
            <h3 className="font-semibold text-lg">We Analyze In Seconds</h3>
            <p className="text-slate-500 text-sm">Our live scraper checks your core structure, elements, and layouts instantly.</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-blue-200">3</div>
            <h3 className="font-semibold text-lg">Get Fixes Instantly</h3>
            <p className="text-slate-500 text-sm">Review your custom breakdown complete with AI action plans to lift sales.</p>
          </div>
        </div>
      </section>

      {/* SAMPLE OUTPUT PREVIEW */}
      <section className="bg-slate-100 py-20 px-4 border-t border-slate-200">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Example output preview</h2>
          <p className="text-slate-500 text-center mb-8 text-sm">Here is a glimpse of the structural breakdowns you will receive:</p>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/60 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2">
              <p className="text-red-600 font-medium text-sm flex items-center gap-2">❌ Your website loads too slowly on mobile</p>
              <p className="text-green-700 font-medium text-sm pl-6">✅ Fix: Simplify your top section</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2">
              <p className="text-red-600 font-medium text-sm flex items-center gap-2">❌ Your contact button is hard to find</p>
              <p className="text-green-700 font-medium text-sm pl-6">✅ Fix: Add visible “Call Now” button</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2">
              <p className="text-red-600 font-medium text-sm flex items-center gap-2">❌ Your homepage doesn’t clearly explain your service</p>
              <p className="text-green-700 font-medium text-sm pl-6">✅ Fix: Rework your text headlines for clarity</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}