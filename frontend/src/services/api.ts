import axios from 'axios';
import type { MatchResponse } from '../types';

const API_BASE_URL = '/api/v1';

export const api = {
    async runMatchmaker(businessInfo: string, query: string): Promise<MatchResponse[]> {
        const response = await axios.post(`${API_BASE_URL}/matchmaker/chat`, {
            user_company_info: businessInfo,
            search_query: query,
            platforms: ['indeed', 'openclassrooms']
        });
        return response.data;
    }
};
