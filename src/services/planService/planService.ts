import { axiosInstance } from "../axiosInstance/axiosInstance";

export interface Plan {
  id: number;
  name: string;
  duration: number;
  price: number;
  features: string[];
  isPopular: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanInput {
  name: string;
  duration: number;
  price: number;
  features: string[];
  isPopular?: boolean;
  isDefault?: boolean;
}

export interface UpdatePlanInput {
  name?: string;
  duration?: number;
  price?: number;
  features?: string[];
  isPopular?: boolean;
  isDefault?: boolean;
}

export const planService = {
  async getAllPlans(): Promise<Plan[]> {
    const response = await axiosInstance.get<Plan[]>("/plans");
    return response.data;
  },

  async getPlanById(id: number): Promise<Plan> {
    const response = await axiosInstance.get<Plan>(`/plans/${id}`);
    return response.data;
  },

  async createPlan(input: CreatePlanInput): Promise<Plan> {
    const response = await axiosInstance.post<Plan>("/plans", input);
    return response.data;
  },

  async updatePlan(id: number, input: UpdatePlanInput): Promise<Plan> {
    const response = await axiosInstance.put<Plan>(`/plans/${id}`, input);
    return response.data;
  },

  async deletePlan(id: number): Promise<{ message: string }> {
    const response = await axiosInstance.delete<{ message: string }>(`/plans/${id}`);
    return response.data;
  },
};

