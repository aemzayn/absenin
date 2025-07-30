import type { Route } from "./+types/home";
import { EventService } from "~/services/event.service";
import type { Event } from "~/interfaces/event";
import { HomePage } from "~/pages/home/HomePage";

export function meta() {
  return [{ title: "Home" }];
}

export async function clientLoader() {
  const res = await EventService.getUpcomingEvents();
  const events = res.data.data ?? [];
  return { events };
}

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  const events: Event[] = loaderData.events;

  return <HomePage events={events} />;
}
