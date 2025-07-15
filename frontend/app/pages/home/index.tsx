import { EventListHome } from "~/components/event-list-home";
import type { Event } from "~/interfaces/event";

type HomeProps = {
  events: Event[];
};

export function Home({ events }: HomeProps) {
  return (
    <div>
      <EventListHome events={events} />
    </div>
  );
}
