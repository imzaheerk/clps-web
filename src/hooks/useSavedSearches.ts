import { useState, useCallback } from "react";
import {
  savedSearchService,
  type SavedSearch,
  type CreateSavedSearchInput,
  type UpdateSavedSearchInput,
} from "@/services/savedSearchService/savedSearchService";
import { showNotification } from "@/components";

export function useSavedSearches(userId: number | null) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!userId) return;
    if (!silent) setLoading(true);
    try {
      const data = await savedSearchService.list(userId);
      setSavedSearches(data.savedSearches);
      setTotal(data.total);
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load saved searches";
      showNotification(message, "error");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [userId]);

  const saveSearch = useCallback(
    async (input: CreateSavedSearchInput) => {
      if (!userId) return false;
      setSaving(true);
      try {
        const created = await savedSearchService.create(userId, input);
        setSavedSearches((prev) => [created, ...prev]);
        setTotal((t) => t + 1);
        showNotification("Search saved — we'll notify you when new matches appear", "success");
        return true;
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to save search";
        showNotification(message, "error");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [userId]
  );

  const updateSearch = useCallback(
    async (id: number, input: UpdateSavedSearchInput) => {
      if (!userId) return false;
      setActionLoading(id);
      try {
        const updated = await savedSearchService.update(id, userId, input);
        setSavedSearches((prev) => prev.map((s) => (s.id === id ? updated : s)));
        return true;
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update saved search";
        showNotification(message, "error");
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [userId]
  );

  const deleteSearch = useCallback(
    async (id: number) => {
      if (!userId) return false;
      setActionLoading(id);
      try {
        await savedSearchService.remove(id, userId);
        setSavedSearches((prev) => prev.filter((s) => s.id !== id));
        setTotal((t) => Math.max(0, t - 1));
        showNotification("Saved search removed", "success");
        return true;
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete saved search";
        showNotification(message, "error");
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [userId]
  );

  const checkSearch = useCallback(
    async (id: number) => {
      if (!userId) return null;
      setActionLoading(id);
      try {
        const result = await savedSearchService.check(id, userId);
        setSavedSearches((prev) =>
          prev.map((s) => (s.id === id ? result.savedSearch : s))
        );
        if (result.newMatches > 0) {
          showNotification(
            result.notified
              ? `${result.newMatches} new match${result.newMatches === 1 ? "" : "es"} — check notifications`
              : `${result.newMatches} new match${result.newMatches === 1 ? "" : "es"} found`,
            "info"
          );
        } else {
          showNotification("No new matches since last check", "info");
        }
        return result;
      } catch (err: any) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to check saved search";
        showNotification(message, "error");
        return null;
      } finally {
        setActionLoading(null);
      }
    },
    [userId]
  );

  const isQuerySaved = useCallback(
    (query: string) => {
      const normalized = query.trim().toLowerCase();
      return savedSearches.some((s) => s.query === normalized);
    },
    [savedSearches]
  );

  return {
    savedSearches,
    total,
    loading,
    saving,
    actionLoading,
    load,
    saveSearch,
    updateSearch,
    deleteSearch,
    checkSearch,
    isQuerySaved,
  };
}
