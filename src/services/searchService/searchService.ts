import { axiosInstance } from "../axiosInstance/axiosInstance";
import { UserOutput } from "@/types";
import type { DiscoveryRadiusKm } from "@/constants/discoveryRadius";

export interface SearchInput {
  name?: string;
  mobileNumber?: string;
  limit?: number;
  discoveryRadiusKm?: DiscoveryRadiusKm;
}

export interface SearchResult extends UserOutput {
  isPremium?: boolean;
}

export const searchService = {
  async search(params: SearchInput): Promise<SearchResult[]> {
    // Token is automatically added by axios interceptor if user is authenticated
    const response = await axiosInstance.get<SearchResult[]>("/search", {
      params,
    });
    return response.data;
  },

  async searchByName(name: string, limit?: number, discoveryRadiusKm?: DiscoveryRadiusKm): Promise<SearchResult[]> {
    return this.search({ name, limit, discoveryRadiusKm });
  },

  async searchByMobile(
    mobileNumber: string,
    limit?: number,
    discoveryRadiusKm?: DiscoveryRadiusKm
  ): Promise<SearchResult[]> {
    return this.search({ mobileNumber, limit, discoveryRadiusKm });
  },
};
