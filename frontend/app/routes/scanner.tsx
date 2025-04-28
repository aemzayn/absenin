import { useState } from "react";
import { QrReader } from "~/components/qr-reader/qr-reader";

export function meta() {
  return [
    {
      title: "Scanner",
    },
  ];
}

export default function ScannerPage() {
  const [openQr, setOpenQt] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl">Scan QR Code</h1>

      <div>
        <p>Scan the QR code using your device's camera.</p>
        <p>Make sure to allow camera access for this page.</p>
      </div>

      <button
        className="border rounded-sm px-2 py-1 mt-4 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        onClick={() => setOpenQt(!openQr)}
      >
        {openQr ? "Close QR Code" : "Open QR Code"}
      </button>
      {openQr && <QrReader />}
    </div>
  );
}
