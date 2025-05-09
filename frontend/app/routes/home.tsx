import type { Route } from "./+types/home";
import { EventService } from "~/services/event.service";
import { EventCardHome } from "~/components/event-card-home";
import type { Event } from "~/interfaces/event";

export function meta() {
  return [{ title: "Home" }];
}

export async function clientLoader() {
  const res = await EventService.getUpcomingEvents();
  const events = res.data.data ?? [];

  return {
    events,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const events: Event[] = loaderData.events;
  const totalEvents = events.length;

  return (
    <div className="container mx-auto p-4">
      <div className="mt-4 flex flex-col gap-4">
        {totalEvents === 0 && (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold">No Upcoming Events</h2>
            <p className="text-gray-500">
              There are no upcoming events at the moment.
            </p>
          </div>
        )}

        {events.map((event: Event) => (
          <EventCardHome key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
