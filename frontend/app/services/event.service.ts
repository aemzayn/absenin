import apiClient from "~/api/client";

export class EventService {
  static async getUpcomingEvents() {
    return apiClient.get("/v1/events");
  }

  static async getEventAttendees(eventId: number) {
    return apiClient.get(`/v1/events/${eventId}/attendees`);
  }

  static async getUpcomingEventsByOrganization(organizationId: number) {
    return apiClient.get(`/v1/events/organization/${organizationId}`);
  }
}
