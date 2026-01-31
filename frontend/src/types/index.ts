export interface MatchResponse {
    company_name: string;
    matching_score: number;
    fit_analysis: string;
    reasoning_signals: string[];
    url: string;
    tech_stack: string[];
    summary: string;
}
