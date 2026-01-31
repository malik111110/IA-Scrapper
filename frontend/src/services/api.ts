import axios from 'axios';
import type {
    MatchResponse,
    CompanyProfile,
    CompanyProfileCreate,
    CompanyProfileUpdate,
    OnboardingMessage,
    OnboardingResponse
} from '../types';

const API_BASE_URL = '/api/v1';

export const api = {
    async runMatchmaker(query: string, businessInfo?: string): Promise<MatchResponse[]> {
        const response = await axios.post(`${API_BASE_URL}/matchmaker/chat`, {
            user_company_info: businessInfo,
            search_query: query,
            platforms: ['indeed', 'openclassrooms']
        });
        return response.data;
    },

    async onboard(data: OnboardingMessage): Promise<OnboardingResponse> {
        const response = await axios.post(`${API_BASE_URL}/company/onboard`, data);
        return response.data;
    },

    // Company Profile Endpoints
    async getCompanyProfiles(): Promise<CompanyProfile[]> {
        const response = await axios.get(`${API_BASE_URL}/company/`);
        return response.data;
    },

    async createCompanyProfile(profile: CompanyProfileCreate): Promise<CompanyProfile> {
        const response = await axios.post(`${API_BASE_URL}/company/`, profile);
        return response.data;
    },

    async updateCompanyProfile(id: number, profile: CompanyProfileUpdate): Promise<CompanyProfile> {
        const response = await axios.put(`${API_BASE_URL}/company/${id}`, profile);
        return response.data;
    },

    async deleteCompanyProfile(id: number): Promise<void> {
        await axios.delete(`${API_BASE_URL}/company/${id}`);
    }
};
