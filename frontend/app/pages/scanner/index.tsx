import { useState } from "react";
import { QrReader } from "~/components/qr-reader";
import { QrService } from "~/services/qr.service";
import { AxiosError } from "axios";
import { Check, X } from "lucide-react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import type { Event } from "~/interfaces/event";

type ScannerPageProps = {
  event: Event;
};

export function ScannerPage({ event }: ScannerPageProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [pauseScanner, setPauseScanner] = useState(false);
  const [verificationResult, setVerificationResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    <div>
      <div>
        <span>Absensi untuk acara:</span>
        <h1>{event.name}</h1>
      </div>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Verifikasi QR Code"
      >
        <div>
          {isVerifying ? (
            <div>
              {/* TODO: Add loading spinner */}
              <div></div>
            </div>
          ) : (
            <div>
              {verificationResult ? (
                <div>
                  <h2>QR Code Valid</h2>
                  <Check />
                  <p>QR Code berhasil diverifikasi.</p>
                  <p>Anda dapat menutup jendela ini.</p>
                </div>
              ) : (
                <div>
                  <h2>QR Code Tidak Valid</h2>
                  <X />
                  <p>{errorMessage}</p>
                  <p>Silakan coba lagi.</p>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={() => {
              setShowDialog(false);
              setPauseScanner(false);
              setErrorMessage("");
            }}
          >
            {verificationResult ? "Tutup" : "Coba Lagi"}
          </Button>
        </div>
      </Dialog>

      <div>
        <QrReader pause={pauseScanner} onScanSuccess={onScan} />
      </div>
    </div>
  );
}
