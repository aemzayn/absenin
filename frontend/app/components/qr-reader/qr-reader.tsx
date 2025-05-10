import QrScanner from "qr-scanner";
import QrFrame from "~/assets/qr-frame.svg";
import { useEffect, useRef, useState } from "react";
import "./qr-reader.css";

type Props = {
  onScanSuccess?: (result: QrScanner.ScanResult) => void;
  onScanFail?: (err: string | Error) => void;
};

export function QrReader({
  onScanFail: onScanFailProp,
  onScanSuccess: onScanSuccessProp,
}: Props) {
  const scanner = useRef<QrScanner | null>(
    null
  ) as React.MutableRefObject<QrScanner | null>;
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    setScannedResult(result?.data);
    onScanSuccessProp?.(result);
  };

  const onScanFail = (err: string | Error) => {
    onScanFailProp?.(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
          console.log(err);
        });

      console.log(scanner.current);
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="qr-reader">
      <video ref={videoEl} autoPlay muted playsInline></video>
      <div ref={qrBoxEl} className="qr-box">
        <img
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        />
      </div>
    </div>
  );
}
