import { EventService } from "~/services/event.service";
import type { Route } from "./+types/event-attendees";
import DataTableDemo from "~/components/attendance-table";
import type { Attendee } from "~/interfaces/attendee";
import { AttendeesTable } from "~/components/attendees-table";

export function meta() {
  return [{ title: "Daftar Hadir" }];
}

const PersonCard = ({ name, id }: { name: string; id: number }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center">
        <img
          src={`https://api.dicebear.com/5.x/initials/svg?seed=${name}`}
          alt={name}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-gray-500">ID: {id}</p>
        </div>
      </div>
    </div>
  );
};

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
      <h1 className="text-2xl font-bold">Daftar Hadir</h1>
      <p className="mt-2 text-gray-600">
        Here you can view the list of attendees for the event.
      </p>

      <AttendeesTable attendees={attendees} />

      {/* <div>
        {attendees.length === 0 ? (
          <p className="mt-4 text-gray-500">No attendees found.</p>
        ) : (
          <div className="mt-4">
            {attendees.map((attendee) => (
              <PersonCard key={attendee.id} {...attendee} />
            ))}
          </div>
        )}
      </div> */}
      {/* <DataTableDemo /> */}
    </div>
  );
}
