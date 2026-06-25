import { useState, useCallback } from "react";
import {
  eventService,
  type LocalEvent,
  type EventQuery,
  type CreateEventInput,
  type UpdateEventInput,
  type EventCategory,
} from "@/services/eventService/eventService";
import { showNotification } from "@/components";

export function useEvents() {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadByPincode = useCallback(async (pincode: string, query?: EventQuery) => {
    if (!query?.silent) setLoading(true);
    try {
      const data = await eventService.getEventsByPincode(pincode, query);
      setEvents(data.events);
      setTotal(data.total);
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load events";
      showNotification(message, "error");
    } finally {
      if (!query?.silent) setLoading(false);
    }
  }, []);

  const loadByUserId = useCallback(async (userId: number, query?: EventQuery) => {
    if (!query?.silent) setLoading(true);
    try {
      const data = await eventService.getEventsByUserId(userId, query);
      setEvents(data.events);
      setTotal(data.total);
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load events";
      showNotification(message, "error");
    } finally {
      if (!query?.silent) setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (userId: number, input: CreateEventInput) => {
    setActionLoading(true);
    try {
      const event = await eventService.createEvent(userId, input);
      showNotification("Event created!", "success");
      return event;
    } catch (err: any) {
      showNotification(err.response?.data?.error || "Failed to create event", "error");
      return null;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const updateEvent = useCallback(
    async (id: number, userId: number, input: UpdateEventInput) => {
      setActionLoading(true);
      try {
        const event = await eventService.updateEvent(id, userId, input);
        showNotification("Event updated", "success");
        return event;
      } catch (err: any) {
        showNotification(err.response?.data?.error || "Failed to update event", "error");
        return null;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  const deleteEvent = useCallback(async (id: number, userId: number) => {
    setActionLoading(true);
    try {
      await eventService.deleteEvent(id, userId);
      showNotification("Event removed", "success");
      return true;
    } catch (err: any) {
      showNotification(err.response?.data?.error || "Failed to delete event", "error");
      return false;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const toggleRsvp = useCallback(async (event: LocalEvent, userId: number) => {
    setActionLoading(true);
    try {
      const updated = event.userHasRsvp
        ? await eventService.cancelRsvp(event.id, userId)
        : await eventService.rsvp(event.id, userId);
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      showNotification(
        updated.userHasRsvp ? "You're going!" : "RSVP cancelled",
        "success"
      );
      return updated;
    } catch (err: any) {
      showNotification(err.response?.data?.error || "RSVP failed", "error");
      return null;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    events,
    total,
    loading,
    actionLoading,
    loadByPincode,
    loadByUserId,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleRsvp,
    setEvents,
  };
}

export type { EventCategory };
