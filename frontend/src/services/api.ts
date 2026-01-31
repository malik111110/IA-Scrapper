import axios from 'axios';
import type { Opportunity, MatchResponse } from '../types';

const API_BASE_URL = '/api/v1';

export const api = {
    async getOpportunities(limit = 20): Promise<{ total: number, opportunities: Opportunity[] }> {
        const response = await axios.get(`${API_BASE_URL}/opportunities/`, {
            params: { limit }
        });
        return response.data;
    },

    async runMatchmaker(businessInfo: string, query: string): Promise<MatchResponse[]> {
        const response = await axios.post(`${API_BASE_URL}/matchmaker/chat`, {
            user_company_info: businessInfo,
            search_query: query,
            platforms: ['indeed', 'openclassrooms']
        });
        return response.data;
    }
};
