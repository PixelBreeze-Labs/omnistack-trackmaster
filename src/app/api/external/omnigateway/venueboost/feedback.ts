import { createOmniGateway } from "../index";

export interface Feedback {
  id: string;
  customer_id: string;
  store_id: string;
  sales_associate_id: string;
  visit_date: string;
  overall_satisfaction: number;
  product_quality: number;
  staff_knowledge: number;
  staff_friendliness: number;
  store_cleanliness: number;
  value_for_money: number;
  found_desired_product: boolean;
  product_feedback: string;
  service_feedback: string;
  improvement_suggestions: string;
  would_recommend: boolean;
  purchase_made: boolean;
  purchase_amount: number;
  preferred_communication_channel: string;
  subscribe_to_newsletter: boolean;
  date: string;
  customer: {
    name: string;
    email: string;
    avatar: string | null;
  };
  category: string;
  status: string;
}

export interface VenueBoostFeedbackResponse {
  data: Feedback[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface FeedbackStatsResponse {
    averageRating: number;
    totalFeedback: number;
    satisfactionScore: number;
    trending: string;
  }

export const createVenueBoostFeedbackApi = (apiKey: string) => {
  const api = createOmniGateway(apiKey);
  return {
    getFeedback: async (params: {
      page?: number;
      per_page?: number;
      search?: string;
      status?: string;
    }): Promise<VenueBoostFeedbackResponse> => {
      const { data } = await api.get("/vb/feedback", { params });
      return data;
    },
    getFeedbackById: async (id: string): Promise<Feedback> => {
      const { data } = await api.get(`/vb/feedback/${id}`);
      return data;
    },
    getFeedbackStats: async (): Promise<FeedbackStatsResponse> => {
        const { data } = await api.get("/vb/feedback/stats");
        return data;
      },
  };
};
