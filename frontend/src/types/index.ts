export interface TechSignal {
    id?: number;
    category: string;
    description: string;
    urgency: number;
}

export interface Opportunity {
    id: number;
    company_name: string;
    sector?: string;
    url: string;
    score: number;
    classification: string;
    signals: TechSignal[];
    tech_stack: string[];
    summary: string;
    detected_at?: string;
}

export interface MatchResponse {
    company_name: string;
    matching_score: number;
    fit_analysis: string;
    reasoning_signals: string[];
    url: string;
    tech_stack: string[];
    summary: string;
}
