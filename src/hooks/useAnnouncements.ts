import { useState, useCallback } from "react";
import {
  announcementService,
  type Announcement,
  type AnnouncementQuery,
  type CreateAnnouncementInput,
  type UpdateAnnouncementInput,
  type ReactionType,
} from "@/services/announcementService/announcementService";
import { showNotification } from "@/components";

interface UseAnnouncementsReturn {
  announcements: Announcement[];
  total: number;
  loading: boolean;
  error: string | null;
  loadAnnouncementsByPincode: (
    pincode: string,
    query?: AnnouncementQuery
  ) => Promise<void>;
  loadAnnouncementsByUserId: (
    userId: number,
    query?: AnnouncementQuery
  ) => Promise<void>;
  createAnnouncement: (
    userId: number,
    input: CreateAnnouncementInput
  ) => Promise<Announcement | null>;
  updateAnnouncement: (
    id: number,
    userId: number,
    input: UpdateAnnouncementInput
  ) => Promise<Announcement | null>;
  deleteAnnouncement: (id: number, userId: number) => Promise<boolean>;
  reactToAnnouncement: (
    announcementId: number,
    userId: number,
    type: ReactionType
  ) => Promise<boolean>;
  removeReaction: (announcementId: number, userId: number) => Promise<boolean>;
  clearError: () => void;
}

export const useAnnouncements = (): UseAnnouncementsReturn => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnnouncementsByPincode = useCallback(
    async (pincode: string, query?: AnnouncementQuery) => {
      if (!query?.silent) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await announcementService.getAnnouncementsByPincode(
          pincode,
          query
        );
        setAnnouncements(data.announcements);
        setTotal(data.total);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to load announcements";
        setError(errorMessage);
        showNotification(errorMessage, "error");
      } finally {
        if (!query?.silent) setLoading(false);
      }
    },
    []
  );

  const loadAnnouncementsByUserId = useCallback(
    async (userId: number, query?: AnnouncementQuery) => {
      if (!query?.silent) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await announcementService.getAnnouncementsByUserId(
          userId,
          query
        );
        setAnnouncements(data.announcements);
        setTotal(data.total);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to load announcements";
        setError(errorMessage);
        showNotification(errorMessage, "error");
      } finally {
        if (!query?.silent) setLoading(false);
      }
    },
    []
  );

  const createAnnouncement = useCallback(
    async (
      userId: number,
      input: CreateAnnouncementInput
    ): Promise<Announcement | null> => {
      setLoading(true);
      setError(null);

      try {
        const newAnnouncement = await announcementService.createAnnouncement(
          userId,
          input
        );
        showNotification("Announcement created successfully!", "success");
        return newAnnouncement;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to create announcement";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAnnouncement = useCallback(
    async (
      id: number,
      userId: number,
      input: UpdateAnnouncementInput
    ): Promise<Announcement | null> => {
      setLoading(true);
      setError(null);

      try {
        const updatedAnnouncement =
          await announcementService.updateAnnouncement(id, userId, input);
        showNotification("Announcement updated successfully!", "success");
        return updatedAnnouncement;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to update announcement";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAnnouncement = useCallback(
    async (id: number, userId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await announcementService.deleteAnnouncement(id, userId);
        showNotification("Announcement deleted successfully!", "success");
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to delete announcement";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reactToAnnouncement = useCallback(
    async (
      announcementId: number,
      userId: number,
      type: ReactionType
    ): Promise<boolean> => {
      setError(null);
      try {
        await announcementService.reactToAnnouncement(
          announcementId,
          userId,
          type
        );
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to update reaction";
        showNotification(errorMessage, "error");
        return false;
      }
    },
    []
  );

  const removeReaction = useCallback(
    async (announcementId: number, userId: number): Promise<boolean> => {
      setError(null);
      try {
        await announcementService.removeReaction(announcementId, userId);
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to remove reaction";
        showNotification(errorMessage, "error");
        return false;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    announcements,
    total,
    loading,
    error,
    loadAnnouncementsByPincode,
    loadAnnouncementsByUserId,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    reactToAnnouncement,
    removeReaction,
    clearError,
  };
};
