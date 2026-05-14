import { axiosInstance } from "../axiosInstance/axiosInstance";
import { UserOutput } from "@/types";

export interface SearchInput {
  name?: string;
  mobileNumber?: string;
  limit?: number;
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

  async searchByName(name: string, limit?: number): Promise<SearchResult[]> {
    return this.search({ name, limit });
  },

  async searchByMobile(
    mobileNumber: string,
    limit?: number
  ): Promise<SearchResult[]> {
    return this.search({ mobileNumber, limit });
  },
};
