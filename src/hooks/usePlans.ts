import { useState, useEffect, useCallback } from "react";
import { planService, type Plan, type CreatePlanInput, type UpdatePlanInput } from "@/services/planService/planService";

interface UsePlansReturn {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  refreshPlans: () => Promise<void>;
  createPlan: (input: CreatePlanInput) => Promise<Plan | null>;
  updatePlan: (id: number, input: UpdatePlanInput) => Promise<Plan | null>;
  deletePlan: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const usePlans = (autoLoad: boolean = true): UsePlansReturn => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await planService.getAllPlans();
      setPlans(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadPlans();
    }
  }, [autoLoad, loadPlans]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshPlans = useCallback(async () => {
    await loadPlans();
  }, [loadPlans]);

  const createPlan = useCallback(async (input: CreatePlanInput): Promise<Plan | null> => {
    setLoading(true);
    setError(null);

    try {
      const newPlan = await planService.createPlan(input);
      await loadPlans(); // Refresh the list
      return newPlan;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create plan");
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadPlans]);

  const updatePlan = useCallback(async (id: number, input: UpdatePlanInput): Promise<Plan | null> => {
    setLoading(true);
    setError(null);

    try {
      const updatedPlan = await planService.updatePlan(id, input);
      await loadPlans(); // Refresh the list
      return updatedPlan;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update plan");
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadPlans]);

  const deletePlan = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await planService.deletePlan(id);
      await loadPlans(); // Refresh the list
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete plan");
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadPlans]);

  return {
    plans,
    loading,
    error,
    refreshPlans,
    createPlan,
    updatePlan,
    deletePlan,
    clearError,
  };
};

