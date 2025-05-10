import { useState } from "react";
import { QrReader } from "~/components/qr-reader/qr-reader";
import type { Route } from "./+types/scanner";
import { redirect } from "react-router";
import { EventService } from "~/services/event.service";
import type { Event } from "~/interfaces/event";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { QrService } from "~/services/qr.service";
import { AxiosError } from "axios";
import { Check, X } from "lucide-react";
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

export default function ScannerPage({ loaderData }: Route.ComponentProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [pauseScanner, setPauseScanner] = useState(false);
  const [verificationResult, setVerificationResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const event: Event = loaderData.event;

  const onScan = async (data: string | undefined) => {
    if (!data) return;
    setPauseScanner(true);
    setShowDialog(true);
    setIsVerifying(true);

    try {
      const res = await QrService.signQrCode(data, event.id);
      if (res.status === 200) {
        setVerificationResult(true);
        setPauseScanner(false);
      }
    } catch (error) {
      setVerificationResult(false);
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 400) {
          const message = error.response?.data.error;
          setErrorMessage(message ?? "QR Code tidak valid");
        } else {
          setErrorMessage("Terjadi kesalahan saat memverifikasi QR Code");
        }
      } else {
        setErrorMessage("Terjadi kesalahan saat memverifikasi QR Code");
      }
    } finally {
      setIsVerifying(false);
    }
    console.log(data);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="text-center">
        <span>Absensi untuk acara:</span>
        <h1 className="text-2xl">{event.name}</h1>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isVerifying
                ? "QR Code sedang diverifikasi..."
                : "Verifikasi selesai"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center">
            {isVerifying ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {verificationResult ? (
                  <div className="text-center">
                    <h2 className="text-lg font-semibold">QR Code Valid</h2>
                    <Check className="text-blue-500 h-25 w-25" />
                    <p className="text-sm text-gray-500">
                      QR Code berhasil diverifikasi.
                    </p>
                    <p className="text-sm text-gray-500">
                      Anda dapat menutup jendela ini.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold">
                      QR Code Tidak Valid
                    </h2>
                    <X className="text-red-500  h-25 w-25" />
                    <p className="text-sm text-gray-500">{errorMessage}</p>
                    <p className="text-sm text-gray-500">Silakan coba lagi.</p>
                  </div>
                )}
              </div>
            )}

            <Button
              className="mt-4"
              variant={verificationResult ? "default" : "neutral"}
              onClick={() => {
                setShowDialog(false);
                setPauseScanner(false);
                setErrorMessage("");
              }}
            >
              {verificationResult ? "Tutup" : "Coba Lagi"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-4 w-full ">
        <QrReader pause={pauseScanner} onScanSuccess={onScan} />
      </div>
    </div>
  );
}
