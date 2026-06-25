import { axiosInstance } from "../axiosInstance/axiosInstance";

export interface SavedSearch {
  id: number;
  userId: number;
  query: string;
  label: string | null;
  alertsEnabled: boolean;
  lastMatchCount: number;
  lastPeopleCount: number;
  lastBusinessCount: number;
  lastCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
  newMatchesSinceLastCheck?: number;
}

export interface SavedSearchListResponse {
  savedSearches: SavedSearch[];
  total: number;
}

export interface CreateSavedSearchInput {
  query: string;
  label?: string;
  alertsEnabled?: boolean;
  peopleCount?: number;
  businessCount?: number;
}

export interface UpdateSavedSearchInput {
  label?: string;
  alertsEnabled?: boolean;
}

export interface CheckSavedSearchResponse {
  savedSearch: SavedSearch;
  currentMatchCount: number;
  newMatches: number;
  notified: boolean;
}

export const savedSearchService = {
  async list(userId: number): Promise<SavedSearchListResponse> {
    const { data } = await axiosInstance.get<SavedSearchListResponse>(
      `/saved-searches/user/${userId}`
    );
    return data;
  },

  async create(userId: number, input: CreateSavedSearchInput): Promise<SavedSearch> {
    const { data } = await axiosInstance.post<SavedSearch>(
      `/saved-searches/user/${userId}`,
      input
    );
    return data;
  },

  async update(
    id: number,
    userId: number,
    input: UpdateSavedSearchInput
  ): Promise<SavedSearch> {
    const { data } = await axiosInstance.patch<SavedSearch>(
      `/saved-searches/${id}/user/${userId}`,
      input
    );
    return data;
  },

  async remove(id: number, userId: number): Promise<void> {
    await axiosInstance.delete(`/saved-searches/${id}/user/${userId}`);
  },

  async check(id: number, userId: number): Promise<CheckSavedSearchResponse> {
    const { data } = await axiosInstance.post<CheckSavedSearchResponse>(
      `/saved-searches/${id}/check/user/${userId}`
    );
    return data;
  },
};
