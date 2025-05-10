import QrScanner from "qr-scanner";
import QrFrame from "~/assets/qr-frame.svg";
import { useEffect, useRef, useState } from "react";

type Props = {
  onScanSuccess?: (result: string | undefined) => void;
  onScanFail?: (err: string | Error) => void;
  pause?: boolean;
};

export function QrReader({
  pause = false,
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
    onScanSuccessProp?.(result?.data);
  };

  const onScanFail = (err: string | Error) => {
    onScanFailProp?.(err);
  };

  useEffect(() => {
    if (scanner.current) {
      if (pause) {
        scanner.current.pause();
      } else {
        scanner.current.start();
      }
    }
  }, [pause]);

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
    <div className="md:w-[400px] w-full h-[500px] relative mx-auto border-3 rounded-lg overflow-hidden bg-gray-200">
      <video
        className="h-full w-full object-cover"
        ref={videoEl}
        autoPlay
        muted
        playsInline
      ></video>
      <div
        ref={qrBoxEl}
        className="absolute inset-0 flex items-center justify-center"
      >
        <img
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className=""
        />
      </div>
    </div>
  );
}
