import { AttendeesTable } from "~/components/table/attendees-table";
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
