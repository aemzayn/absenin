import { EventService } from "~/services/event.service";
import type { Route } from "./+types/event-attendees";
import type { Attendee } from "~/interfaces/attendee";
import { AttendeesTable } from "~/components/table/attendees-table";

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

export default function EventAttendeesPage({
  loaderData,
}: Route.ComponentProps) {
  const attendees: Attendee[] = loaderData.attendees;

  return (
    <div>
      <h1>Daftar Hadir</h1>
      <AttendeesTable attendees={attendees} />
    </div>
  );
}
