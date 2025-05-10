import type { Route } from "./+types/home";
import { EventService } from "~/services/event.service";
import type { Event } from "~/interfaces/event";
import { EventListHome } from "~/components/event-list-home";

export function meta() {
  return [{ title: "Home" }];
}

export async function clientLoader() {
  const res = await EventService.getUpcomingEvents();
  const events = res.data.data ?? [];
  return { events };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const events: Event[] = loaderData.events;

  return (
    <div className="container mx-auto p-4">
      <EventListHome events={events} />
    </div>
  );
}
