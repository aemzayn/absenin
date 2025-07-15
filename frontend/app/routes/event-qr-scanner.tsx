import { EventQrScanner } from "~/pages/event-qr-scanner";

export function meta() {
  return [{ title: "San QR Event" }];
}

export default function EventQrScannerRoute() {
  return <EventQrScanner />;
}
