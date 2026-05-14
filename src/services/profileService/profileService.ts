import { axiosInstance } from "../axiosInstance/axiosInstance";
import { UserOutput } from "@/types";

export interface UpdateProfileInput {
  name?: string;
  country?: string;
  city?: string;
  state?: string;
  pincode?: string;
  area?: string;
  isActive?: boolean;
}

export const profileService = {
  async updateProfile(
    userId: number,
    data: UpdateProfileInput
  ): Promise<UserOutput> {
    const response = await axiosInstance.put<UserOutput>(
      `/users/${userId}`,
      data
    );
    return response.data;
  },

  async getProfile(userId: number, viewerId?: number): Promise<UserOutput> {
    const url = viewerId
      ? `/users/${userId}?viewerId=${viewerId}`
      : `/users/${userId}`;
    const response = await axiosInstance.get<UserOutput>(url);
    return response.data;
  },
};
