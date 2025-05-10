import { useState } from "react";
import { QrReader } from "~/components/qr-reader/qr-reader";
import type { Route } from "./+types/scanner";
import { redirect, useLoaderData } from "react-router";
import { EventService } from "~/services/event.service";
import type { Event } from "~/interfaces/event";
import { Button } from "~/components/ui/button";

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

export default function ScannerPage() {
  const [openQr, setOpenQt] = useState(false);

  const loaderData = useLoaderData<typeof clientLoader>();
  const event = loaderData.event;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl">Scan QR Code</h1>

      <Button
        className="border rounded-sm px-2 py-1 mt-4 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        onClick={() => setOpenQt(!openQr)}
      >
        {openQr ? "Close QR Code" : "Open QR Code"}
      </Button>

      <div className="mt-4 h-52 bg-blue-200 border-2 w-full rounded-md">
        {openQr && <QrReader />}
      </div>
    </div>
  );
}
