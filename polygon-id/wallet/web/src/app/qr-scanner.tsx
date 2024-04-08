import { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

export default function QRScanner({
  onScan: onScan,
}: {
  onScan: (c: string) => void;
}) {
  const [scanning, setScanning] = useState(true);

  return (
    <>
      {/* White background overlay */}
      <div className="absolute w-full h-full bg-slate-400 z-10" />

      {/* Scan QR code title */}
      <div className="absolute top-1/4 w-full text-center z-30">
        <h1 className="text-2xl font-bold text-white">Scan QR code</h1>
      </div>

      {/* QR code scanner */}
      {scanning && (
        <QrScanner
          containerStyle={{
            position: "absolute",
            zIndex: 20,
            padding: "0",
            width: "100%",
            height: "100%",
          }}
          onDecode={(result) => {
            setScanning(false);
            onScan(result);
          }}
          onError={(error) => {}}
        />
      )}
    </>
  );
}
