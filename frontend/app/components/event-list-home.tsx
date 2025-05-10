import type { Event } from "~/interfaces/event";
import { EventCardHome } from "./event-card-home";
import { groupEvents } from "~/lib/group-events";
import { useMemo } from "react";

type Props = {
  events: Event[];
};

export const EventListHome = ({ events }: Props) => {
  const totalEvents = events.length;

  const { todayEvents, thisWeekEvents, futureEvents } = useMemo(() => {
    return groupEvents(events);
  }, [events]);

  return (
    <div className="mt-4 flex flex-col gap-4">
      {totalEvents === 0 && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold">Tidak ada acara</h2>
          <p className="text-gray-500">
            Saat ini tidak ada acara yang tersedia. Silahkan membuat acara baru.
          </p>
        </div>
      )}

      <div>
        <h1 className="text-lg font-semibold mb-2">
          Acara hari ini ({todayEvents.length} acara)
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todayEvents.map((event: Event) => (
            <EventCardHome key={event.id} event={event} />
          ))}
        </div>
      </div>

      {thisWeekEvents.length > 0 && (
        <div>
          <h1 className="text-lg font-semibold mb-2">
            Acara pekan ini ({thisWeekEvents.length} acara)
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {thisWeekEvents.map((event: Event) => (
              <EventCardHome key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {futureEvents.length > 0 && (
        <div className="mt-4">
          <h1 className="text-lg font-semibold mb-2">
            Acara mendatang ({futureEvents.length} acara)
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {futureEvents.map((event: Event) => (
              <EventCardHome key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
