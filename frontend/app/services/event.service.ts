import apiClient from "~/api/client";
import type { CreateEvent } from "~/interfaces/event";

export class EventService {
  static async getUpcomingEvents() {
    return apiClient.get("/v1/events");
  }

  static async getEvent(eventId: number) {
    return apiClient.get(`/v1/events/${eventId}`);
  }

  static async createEvent(event: CreateEvent) {
    return apiClient.post("/v1/events", event);
  }

  static async getEventAttendees(eventId: number) {
    return apiClient.get(`/v1/events/${eventId}/attendees`);
  }

  static async getUpcomingEventsByOrganization(organizationId: number) {
    return apiClient.get(`/v1/events/organization/${organizationId}`);
  }

  static async updateEvent(eventId: number, event: CreateEvent) {
    return apiClient.put(`/v1/events/${eventId}`, event);
  }

  static async deleteEvent(eventId: number) {
    return apiClient.delete(`/v1/events/${eventId}`);
  }
}
