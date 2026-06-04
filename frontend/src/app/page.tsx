"use client";

import { useState, type FormEvent } from "react";

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

  // Helper type guard to make rendering the typed AI block clean
  const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

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

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "premium-website-report.pdf";
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setPremiumLoading(false);
    }
  };

  const aiReportData = getAiReportData(report?.ai_report);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-700 uppercase">Web Analyzer</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Login</button>
            <button className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">Register</button>
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