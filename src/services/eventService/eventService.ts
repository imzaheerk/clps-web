import { axiosInstance } from "../axiosInstance/axiosInstance";

export type EventCategory = "community" | "meetup" | "workshop" | "sports" | "other";

export interface LocalEvent {
  id: number;
  userId: number;
  title: string;
  description: string;
  location: string | null;
  pincode: string;
  eventDate: string;
  category: EventCategory;
  maxAttendees: number | null;
  isActive: boolean;
  rsvpCount: number;
  userHasRsvp: boolean;
  isFull: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string | null;
  };
}

export interface EventListResponse {
  events: LocalEvent[];
  total: number;
}

export interface EventQuery {
  limit?: number;
  offset?: number;
  currentUserId?: number;
  upcoming?: boolean;
  category?: EventCategory;
  /** Client-only — not sent to API */
  silent?: boolean;
}

export interface CreateEventInput {
  title: string;
  description: string;
  location?: string;
  eventDate: string;
  category?: EventCategory;
  maxAttendees?: number;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  location?: string;
  eventDate?: string;
  category?: EventCategory;
  maxAttendees?: number | null;
  isActive?: boolean;
}

export interface EventAttendee {
  id: number;
  name: string | null;
  rsvpAt: string;
}

export const eventService = {
  async getEventsByPincode(
    pincode: string,
    query?: EventQuery
  ): Promise<EventListResponse> {
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.offset) params.append("offset", String(query.offset));
    if (query?.currentUserId != null) {
      params.append("currentUserId", String(query.currentUserId));
    }
    if (query?.upcoming === false) params.append("upcoming", "false");
    if (query?.category) params.append("category", query.category);

    const res = await axiosInstance.get<EventListResponse>(
      `/events/pincode/${pincode}?${params.toString()}`
    );
    return res.data;
  },

  async getEventsByUserId(userId: number, query?: EventQuery): Promise<EventListResponse> {
    const params = new URLSearchParams();
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.offset) params.append("offset", String(query.offset));
    if (query?.currentUserId != null) {
      params.append("currentUserId", String(query.currentUserId));
    }

    const res = await axiosInstance.get<EventListResponse>(
      `/events/user/${userId}?${params.toString()}`
    );
    return res.data;
  },

  async getEventById(id: number, currentUserId?: number): Promise<LocalEvent> {
    const params = new URLSearchParams();
    if (currentUserId != null) params.append("currentUserId", String(currentUserId));
    const qs = params.toString();
    const url = qs ? `/events/${id}?${qs}` : `/events/${id}`;
    const res = await axiosInstance.get<LocalEvent>(url);
    return res.data;
  },

  async createEvent(userId: number, input: CreateEventInput): Promise<LocalEvent> {
    const res = await axiosInstance.post<LocalEvent>(`/events/user/${userId}`, input);
    return res.data;
  },

  async updateEvent(
    id: number,
    userId: number,
    input: UpdateEventInput
  ): Promise<LocalEvent> {
    const res = await axiosInstance.put<LocalEvent>(`/events/${id}/user/${userId}`, input);
    return res.data;
  },

  async deleteEvent(id: number, userId: number): Promise<void> {
    await axiosInstance.delete(`/events/${id}/user/${userId}`);
  },

  async rsvp(eventId: number, userId: number): Promise<LocalEvent> {
    const res = await axiosInstance.post<LocalEvent>(
      `/events/${eventId}/rsvp/user/${userId}`
    );
    return res.data;
  },

  async cancelRsvp(eventId: number, userId: number): Promise<LocalEvent> {
    const res = await axiosInstance.delete<LocalEvent>(
      `/events/${eventId}/rsvp/user/${userId}`
    );
    return res.data;
  },

  async getAttendees(eventId: number): Promise<{ attendees: EventAttendee[]; total: number }> {
    const res = await axiosInstance.get<{ attendees: EventAttendee[]; total: number }>(
      `/events/${eventId}/attendees`
    );
    return res.data;
  },
};

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "community", label: "Community" },
  { value: "meetup", label: "Meetup" },
  { value: "workshop", label: "Workshop" },
  { value: "sports", label: "Sports" },
  { value: "other", label: "Other" },
];
