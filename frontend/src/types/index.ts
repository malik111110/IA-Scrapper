export interface MatchResponse {
    company_name: string;
    matching_score: number;
    fit_analysis: string;
    reasoning_signals: string[];
    url: string;
    tech_stack: string[];
    summary: string;
}

export interface CompanyProfile {
    id: number;
    name: string;
    description: string;
    services: string[];
    equipment: string[];
    experience_years: number;
    specialties: string[];
    mission: string;
    target_audience: string;
    website: string;
    contact_email: string;
    created_at: string;
    updated_at: string;
}

export type CompanyProfileCreate = Omit<CompanyProfile, 'id' | 'created_at' | 'updated_at'>;
export type CompanyProfileUpdate = Partial<CompanyProfileCreate>;

export interface OnboardingMessage {
    message: string;
    history: { role: 'user' | 'assistant', content: string }[];
}

export interface OnboardingResponse {
    agent_response: string;
    extracted_profile: Partial<CompanyProfile> | null;
    status: 'ongoing' | 'complete';
}
