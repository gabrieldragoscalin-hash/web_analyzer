"use client";

import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

import AnalysisHero from "../components/AnalysisHero";
import AnalysisResults from "../components/AnalysisResults";
import InfoSections from "../components/InfoSections";
import type { AiReport, AnalysisResponse } from "../components/types";

interface AnalysisRequest {
  url: string;
}

const API_BASE_URL = "https://web-analyzer-backend-622w.onrender.com";

const parseAiReport = (value: string | AiReport): AiReport | string => {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value) as AiReport;
  } catch (error) {
    console.error("Failed to parse AI report string", error);
    return value;
  }
};

const getAiReportData = (aiReport: string | AiReport | undefined): AiReport | null => {
  if (aiReport && typeof aiReport === "object") {
    return aiReport as AiReport;
  }

  return null;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "An unexpected error occurred.";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [premiumLoading, setPremiumLoading] = useState<boolean>(false);
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [report, setReport] = useState<AnalysisResponse | null>(null);

  // Track authenticated user state
  const [user, setUser] = useState<any>(null);

  // Initialize client-side Supabase listener to check authentication state
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUserSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUserSession();

    // Re-verify if auth state changes (sign-in/sign-out updates)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const requestBody: AnalysisRequest = { url: url };

      const response = await fetch(`${API_BASE_URL}/analyze`, {
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
      const parsedAiReport = parseAiReport(data.ai_report);

      setReport({ ...data, ai_report: parsedAiReport });
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleDownloadDetailedReport = async () => {
    if (!url) return;

    setPremiumLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/generate-detailed-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong while generating the detailed report.");
      }

      const data = await response.json();
      const jobId = data.job_id;
      let status = data.status;

      const downloadPdf = async () => {
        const downloadResponse = await fetch(`${API_BASE_URL}/download-report/${jobId}`);
        if (!downloadResponse.ok) {
          const errorData = await downloadResponse.json();
          throw new Error(errorData.detail || "Failed to download the report.");
        }

        const blob = await downloadResponse.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "premium-website-report.pdf";
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      };

      if (status === "ready") {
        await downloadPdf();
      } else {
        const maxAttempts = 20;
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          await sleep(1200);
          const statusResponse = await fetch(`${API_BASE_URL}/report-status/${jobId}`);
          if (!statusResponse.ok) {
            const errorData = await statusResponse.json();
            throw new Error(errorData.detail || "Failed to check report status.");
          }

          const statusData = await statusResponse.json();
          status = statusData.status;

          if (status === "ready") {
            await downloadPdf();
            break;
          }
          if (status === "failed") {
            throw new Error(statusData.error || "Detailed report generation failed.");
          }
        }

        if (status !== "ready") {
          throw new Error("The report is still being generated. Please try again in a moment.");
        }
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setPremiumLoading(false);
    }
  };

  const aiReportData = getAiReportData(report?.ai_report);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_-20px_rgba(15,23,42,0.35)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">⚡</div>
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-blue-700 uppercase">Website Analyzer</p>
              <p className="text-xs text-slate-500">Website health for your bussiness</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={handleLogout}
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

      {/* HERO SECTION */}
      <AnalysisHero
        url={url}
        loading={loading}
        error={error}
        onUrlChange={setUrl}
        onAnalyze={handleAnalyze}
      />

      {/* DYNAMIC RESULTS DISPLAY */}
      {report ? (
        <AnalysisResults
          report={report}
          aiReportData={aiReportData}
          premiumLoading={premiumLoading}
          showContactForm={showContactForm}
          contactEmail={contactEmail}
          contactPhone={contactPhone}
          contactSubmitted={contactSubmitted}
          onDownloadDetailedReport={handleDownloadDetailedReport}
          onToggleContactForm={() => setShowContactForm(true)}
          onContactEmailChange={setContactEmail}
          onContactPhoneChange={setContactPhone}
          onContactSubmit={handleContactSubmit}
        />
      ) : null}

      <InfoSections />
    </div>
  );
}