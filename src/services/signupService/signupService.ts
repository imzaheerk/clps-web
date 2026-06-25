import { axiosInstance } from "../axiosInstance/axiosInstance";
import type { UserOutput } from "@/types";

const API_URL = "/users";

export interface SendOTPResponse {
  message: string;
}

export interface CreateUserInput {
  name: string;
  mobileNumber: string;
  otpCode: string;
  pincode: string;
  country: string;
  state: string;
  city: string;
  area: string;
  numberVisibility?: "fully_visible" | "masked";
  referralCode?: string;
}

export interface CreateUserResponse extends UserOutput {}

export interface SendOTPInput {
  mobileNumber: string;
}

export const sendOTPForSignup = async (payload: SendOTPInput) => {
  const res = await axiosInstance.post<SendOTPResponse>(`${API_URL}/send-otp`, payload);
  return res.data;
};

export const createUser = async (payload: CreateUserInput) => {
  const res = await axiosInstance.post<CreateUserResponse>(API_URL, payload);
  return res.data;
};


