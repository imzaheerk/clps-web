import { axiosInstance } from "../axiosInstance/axiosInstance";

export type CampaignObjective = "footfall" | "orders" | "awareness";
export type CampaignTone = "friendly" | "professional" | "urgent";

export interface GenerateCampaignInput {
  businessName?: string;
  locationLabel?: string;
  season: string;
  offer: string;
  objective: CampaignObjective;
  tone: CampaignTone;
}

export interface CampaignVariant {
  title: string;
  description: string;
  cta: string;
}

export interface GenerateCampaignResponse {
  variants: CampaignVariant[];
  suggestedCategory: "general" | "events" | "jobs" | "safety" | "lost_found";
  bestPostTime: string;
}

export const aiCampaignService = {
  async generateAnnouncementCampaign(input: GenerateCampaignInput): Promise<GenerateCampaignResponse> {
    const response = await axiosInstance.post<GenerateCampaignResponse>(
      "/announcements/ai-campaign/generate",
      input
    );
    return response.data;
  },
};

