import { useState } from "react";
import { QrReader } from "~/components/qr-reader/qr-reader";
import type { Route } from "./+types/scanner";
import { data, redirect, useLoaderData } from "react-router";
import { EventService } from "~/services/event.service";
import type { Event } from "~/interfaces/event";
import { Button } from "~/components/ui/button";
import { QrPlaceholder } from "~/components/qr-reader/qr-placeholder";

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

export default function ScannerPage({ loaderData }: Route.ComponentProps) {
  const [openQr, setOpenQt] = useState(false);
  const [pauseScanner, setPauseScanner] = useState(false);
  const event: Event = loaderData.event;

  const onScan = async (data: string | undefined) => {
    if (!data) return;
    setPauseScanner(true);
    console.log(data);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="text-center">
        <span>Absensi untuk acara:</span>
        <h1 className="text-2xl">{event.name}</h1>
      </div>

      <div className="mt-4 w-full ">
        {openQr ? (
          <QrReader pause={pauseScanner} onScanSuccess={onScan} />
        ) : (
          <QrPlaceholder />
        )}
      </div>

      <Button
        className="border rounded-sm px-2 py-1 mt-4 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        onClick={() => setOpenQt(!openQr)}
      >
        {openQr ? "Close QR Code" : "Open QR Code"}
      </Button>
    </div>
  );
}
