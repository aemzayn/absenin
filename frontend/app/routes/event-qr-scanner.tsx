import { EventQrScannerPage } from "~/pages/event-qr-scanner/EventQrScannerPage";

export function meta() {
  return [{ title: "San QR Event" }];
}

export default function EventQrScannerRoute() {
  return <EventQrScannerPage />;
}
