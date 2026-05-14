import { useState, useCallback } from "react";
import {
  sendOTPForLogin,
  verifyOTPAndLogin,
} from "@/services/loginService/loginService";
import { showNotification } from "@/components";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOTP = useCallback(
    async (mobileNumber: string): Promise<boolean> => {
      if (!mobileNumber || mobileNumber.length !== 10) {
        const errorMsg = "Please enter a valid 10-digit mobile number";
        setError(errorMsg);
        showNotification(errorMsg, "error");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await sendOTPForLogin({ mobileNumber });
        showNotification(
          "OTP sent successfully! Check your server console for the code.",
          "success"
        );
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to send OTP";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const verifyOTP = useCallback(
    async (mobileNumber: string, otpCode: string) => {
      if (!otpCode || otpCode.length !== 6) {
        const errorMsg = "Please enter the complete 6-digit OTP";
        setError(errorMsg);
        showNotification(errorMsg, "error");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await verifyOTPAndLogin({ mobileNumber, otpCode });
        if (response) {
          showNotification("Login successful!", "success");
        }
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Invalid OTP. Please try again.";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    sendOTP,
    verifyOTP,
    clearError,
  };
};
