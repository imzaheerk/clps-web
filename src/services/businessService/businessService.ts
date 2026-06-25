import { axiosInstance } from "../axiosInstance/axiosInstance";

export type BusinessCategory =
  | "restaurant"
  | "shop"
  | "driver"
  | "plumber";

export interface BusinessHoursMap {
  [day: string]: string;
}

export interface SocialLinksMap {
  [platform: string]: string;
}

export interface Business {
  id: number;
  userId: number;
  name: string;
  category: string;
  description: string;
  aadharVerified: boolean;
  licenceVerified: boolean;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  businessHours: BusinessHoursMap | null;
  website: string | null;
  socialLinks: SocialLinksMap | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: { id: number; name: string | null };
}

export interface BusinessListResponse {
  businesses: Business[];
  total: number;
}

export interface BusinessQuery {
  limit?: number;
  offset?: number;
  category?: BusinessCategory;
  isActive?: boolean;
}

export interface CreateBusinessInput {
  name: string;
  category: BusinessCategory;
  description: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  businessHours?: BusinessHoursMap;
  website?: string;
  socialLinks?: SocialLinksMap;
}

export interface UpdateBusinessInput {
  name?: string;
  category?: BusinessCategory;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  businessHours?: BusinessHoursMap;
  website?: string;
  socialLinks?: SocialLinksMap;
  isActive?: boolean;
}

export const businessService = {
  async getMyBusinesses(query?: BusinessQuery): Promise<BusinessListResponse> {
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.offset) params.append("offset", query.offset.toString());
    if (query?.isActive !== undefined)
      params.append("isActive", String(query.isActive));

    const response = await axiosInstance.get<BusinessListResponse>(
      `/businesses/my?${params.toString()}`
    );
    return response.data;
  },

  async getBusinessesByCategory(
    category: string,
    query?: BusinessQuery
  ): Promise<BusinessListResponse> {
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.offset) params.append("offset", query.offset.toString());

    const response = await axiosInstance.get<BusinessListResponse>(
      `/businesses/category/${category}?${params.toString()}`
    );
    return response.data;
  },

  async searchBusinesses(
    keyword: string,
    query?: { limit?: number; offset?: number; discoveryRadiusKm?: number }
  ): Promise<BusinessListResponse> {
    const params = new URLSearchParams();
    if (keyword) params.append("q", keyword);
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.offset) params.append("offset", query.offset.toString());
    if (query?.discoveryRadiusKm !== undefined) {
      params.append("discoveryRadiusKm", String(query.discoveryRadiusKm));
    }

    const response = await axiosInstance.get<BusinessListResponse>(
      `/businesses/search?${params.toString()}`
    );
    return response.data;
  },

  async getBusinessById(id: number): Promise<Business> {
    const response = await axiosInstance.get<Business>(`/businesses/${id}`);
    return response.data;
  },

  async createBusiness(input: CreateBusinessInput): Promise<Business> {
    const response = await axiosInstance.post<Business>("/businesses", input);
    return response.data;
  },

  async updateBusiness(
    id: number,
    input: UpdateBusinessInput
  ): Promise<Business> {
    const response = await axiosInstance.put<Business>(`/businesses/${id}`, input);
    return response.data;
  },

  async deleteBusiness(id: number): Promise<{ message: string }> {
    const response = await axiosInstance.delete<{ message: string }>(
      `/businesses/${id}`
    );
    return response.data;
  },
};
