import { axiosInstance } from "../axiosInstance/axiosInstance";

export interface CommunityCityStats {
  city: string;
  state: string | null;
  members: number;
  businesses: number;
}

export interface CommunityStats {
  totalMembers: number;
  totalBusinesses: number;
  totalAnnouncements: number;
  totalCities: number;
  featuredCity: CommunityCityStats | null;
  cities: CommunityCityStats[];
  updatedAt: string;
}

export function formatStatCount(value: number): string {
  return value.toLocaleString("en-IN");
}

export function cityLabel(city: CommunityCityStats): string {
  return city.state ? `${city.city}, ${city.state}` : city.city;
}

export const communityStatsService = {
  async getStats(city?: string): Promise<CommunityStats> {
    const params = city ? { city } : undefined;
    const { data } = await axiosInstance.get<CommunityStats>("/community/stats", {
      params,
    });
    return data;
  },
};
