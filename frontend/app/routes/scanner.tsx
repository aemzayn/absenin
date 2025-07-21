import { redirect } from "react-router";
import { EventService } from "~/services/event.service";
import { ScannerPage } from "~/pages/scanner/ScannerPage";
import type { Route } from "./+types/scanner";
import type { Event } from "~/interfaces/event";

export function meta() {
  return [{ title: "Scanner" }];
}

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const eventId = +params.eventId;
  if (isNaN(eventId)) {
    return redirect("/not-found");
  }

  const res = await EventService.getEvent(eventId);
  if (res.status !== 200) {
    return redirect("/not-found");
  }
  const event: Event = res.data.data;
  return { event };
};

export default function ScannerRoute({ loaderData }: Route.ComponentProps) {
  const event: Event = loaderData.event;
  return <ScannerPage event={event} />;
}
