import { useState, useEffect, useCallback } from "react";
import { subscriptionService, type Subscription } from "@/services/subscriptionService/subscriptionService";

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  createSubscription: (planId: number) => Promise<boolean>;
  cancelSubscription: (subscriptionId: number) => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
  clearError: () => void;
}

export const useSubscription = (
  userId: number | null,
  autoLoad: boolean = true
): UseSubscriptionReturn => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const loadSubscription = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await subscriptionService.getActiveSubscription(userId);
      setSubscription(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load subscription");
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (autoLoad && userId) {
      loadSubscription();
    }
  }, [autoLoad, userId, loadSubscription]);

  const createSubscription = useCallback(
    async (planId: number): Promise<boolean> => {
      if (!userId) return false;

      setLoading(true);
      setError(null);

      try {
        const newSubscription = await subscriptionService.createSubscription(
          userId,
          { planId }
        );
        setSubscription(newSubscription);
        return true;
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to create subscription");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const cancelSubscription = useCallback(
    async (subscriptionId: number): Promise<boolean> => {
      if (!userId) return false;

      setLoading(true);
      setError(null);

      try {
        await subscriptionService.cancelSubscription(userId, subscriptionId);
        await loadSubscription(); // Reload to get new free plan
        return true;
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to cancel subscription");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId, loadSubscription]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshSubscription = useCallback(async () => {
    await loadSubscription();
  }, [loadSubscription]);

  return {
    subscription,
    loading,
    error,
    createSubscription,
    cancelSubscription,
    refreshSubscription,
    clearError,
  };
};

