import { EventListHome } from "~/components/events/event-list-home/EventListHome";
import type { Event } from "~/interfaces/event";

type HomeProps = {
  events: Event[];
};

export function HomePage({ events }: HomeProps) {
  return (
    <div>
      <EventListHome events={events} />
    </div>
  );
}
