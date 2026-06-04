export interface AiReport {
    summary: string;
    explanation: string;
    priority_fixes: string[] | string;
    business_impact: string;
}

export interface AnalysisResponse {
    url: string;
    score: number;
    issues: string[];
    fixes: string[];
    ai_report: string | AiReport;
}
