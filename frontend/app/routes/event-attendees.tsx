import { EventService } from "~/services/event.service";
import { EventAttendees } from "~/pages/event-attendees";
import type { Route } from "./+types/event-attendees";
import type { Attendee } from "~/interfaces/attendee";

export function meta() {
  return [{ title: "Daftar Hadir" }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const eventId = +params.eventId;

  if (isNaN(eventId)) {
    return { attendees: [], eventId: null };
  }

  const res = await EventService.getEventAttendees(eventId);
  const data = res.data?.data as Attendee[];

  return { attendees: data, eventId };
}

export default function EventAttendeesRoute({
  loaderData,
}: Route.ComponentProps) {
  const attendees: Attendee[] = loaderData.attendees;

  return <EventAttendees attendees={attendees} />;
}
