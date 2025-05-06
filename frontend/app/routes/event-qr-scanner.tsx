export function meta() {
  return [{ title: "San QR Event" }];
}

export default function EventQrScannerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Event QR Scanner</h1>
      <p className="mt-2 text-gray-600">
        Here you can scan the QR code for the event.
      </p>
      {/* Add your QR scanner logic here */}
    </div>
  );
}
