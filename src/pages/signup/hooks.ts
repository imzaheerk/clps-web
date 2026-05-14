import { useState, useCallback } from "react";
import {
  sendOTPForSignup,
  createUser,
  type CreateUserInput,
} from "@/services/signupService/signupService";
import { showNotification } from "@/components";

export const useSignup = () => {
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
        await sendOTPForSignup({ mobileNumber });
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

  const createUserHandler = useCallback(async (data: CreateUserInput) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await createUser(data);
      if (userData) {
        showNotification("Account created successfully!", "success");
      }
      return userData;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid OTP";
      setError(errorMessage);
      showNotification("Invalid OTP", "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    sendOTP,
    createUser: createUserHandler,
    clearError,
  };
};
