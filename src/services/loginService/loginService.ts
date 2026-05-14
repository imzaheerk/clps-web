import { axiosInstance } from "../axiosInstance/axiosInstance";
import type { UserOutput } from "@/types";

const API_URL = "/users/login";

export interface SendOTPResponse {
  message: string;
}

export interface VerifyOTPResponse extends UserOutput {}

export interface SendOTPInput {
  mobileNumber: string;
}

export interface VerifyOTPInput {
  mobileNumber: string;
  otpCode: string;
}

export const sendOTPForLogin = async (payload: SendOTPInput) => {
  const res = await axiosInstance.post<SendOTPResponse>(`${API_URL}/send-otp`, payload);
  return res.data;
};

export const verifyOTPAndLogin = async (payload: VerifyOTPInput) => {
  const res = await axiosInstance.post<VerifyOTPResponse>(`${API_URL}/verify-otp`, payload);
  return res.data;
};


