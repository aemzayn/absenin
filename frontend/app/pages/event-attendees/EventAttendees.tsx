import { AttendeesTable } from "~/components/attendees/attendees-table/AttendeesTable";
import type { Attendee } from "~/interfaces/attendee";

type EventAttendeesPageProps = {
  attendees: Attendee[];
};

export function EventAttendees({ attendees }: EventAttendeesPageProps) {
  return (
    <div>
      <h1>Daftar Hadir</h1>
      <AttendeesTable attendees={attendees} />
    </div>
  );
}
