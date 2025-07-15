import type { Event } from "~/interfaces/event";
import { EventCardHome } from "../../card/event-card-home";
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
    <div>
      {totalEvents === 0 && (
        <div>
          <h2>Tidak ada acara</h2>
          <p>
            Saat ini tidak ada acara yang tersedia. Silahkan membuat acara baru.
          </p>
        </div>
      )}

      <div>
        <h1>Acara hari ini ({todayEvents.length} acara)</h1>
        <div>
          {todayEvents.map((event: Event) => (
            <EventCardHome key={event.id} event={event} />
          ))}
        </div>
      </div>

      {thisWeekEvents.length > 0 && (
        <div>
          <h1>Acara pekan ini ({thisWeekEvents.length} acara)</h1>
          <div>
            {thisWeekEvents.map((event: Event) => (
              <EventCardHome key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {futureEvents.length > 0 && (
        <div>
          <h1>Acara mendatang ({futureEvents.length} acara)</h1>
          <div>
            {futureEvents.map((event: Event) => (
              <EventCardHome key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
