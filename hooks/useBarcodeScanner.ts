import { useEffect, useRef } from "react";
import { DeviceEventEmitter } from "react-native";

interface BarcodeScannerOptions {
  onScan: (barcode: string) => void;
  enabled?: boolean;
  minLength?: number;
}

interface BarcodeScannerResult {
  isReady: boolean;
  isScanning: boolean;
}

export const useBarcodeScanner = ({
  onScan,
  enabled = true,
  minLength = 1,
}: BarcodeScannerOptions): BarcodeScannerResult => {
  const isScanningRef = useRef(false);
  const isReadyRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      isReadyRef.current = false;
      return;
    }

    isReadyRef.current = true;

    // Helper function to handle scanned data
    const handleScannedData = (scannedData: string) => {
      if (!scannedData || scannedData.trim().length < minLength) {
        return;
      }

      const trimmedData = scannedData.trim();
      console.log("Barcode scanned via hook:", trimmedData);

      // Prevent duplicate scans
      if (isScanningRef.current) {
        return;
      }

      isScanningRef.current = true;

      // Call the onScan callback
      onScan(trimmedData);

      // Reset scanning state after a short delay
      setTimeout(() => {
        isScanningRef.current = false;
      }, 500);
    };

    // Listen for Android scanner events (for integrated scanners)
    const scannerListener = DeviceEventEmitter.addListener(
      "onBarcodeScanned",
      (event: { data: string }) => {
        handleScannedData(event.data);
      }
    );

    // Listen for ZXing scanner events (alternative scanner apps)
    const zxingListener = DeviceEventEmitter.addListener(
      "zxingBarcode",
      (event: { data: string }) => {
        handleScannedData(event.data);
      }
    );

    // Listen for generic barcode scan events
    const genericScanListener = DeviceEventEmitter.addListener(
      "barcodeScan",
      (event: { data: string }) => {
        handleScannedData(event.data);
      }
    );

    // Listen for Zebra scanner events (common in warehouses)
    const zebraListener = DeviceEventEmitter.addListener(
      "zebraBarcode",
      (event: { data: string }) => {
        handleScannedData(event.data);
      }
    );

    // Listen for Honeywell scanner events
    const honeywellListener = DeviceEventEmitter.addListener(
      "honeywellBarcode",
      (event: { data: string }) => {
        handleScannedData(event.data);
      }
    );

    // Listen for DataWedge scanner events (Zebra DataWedge)
    const dataWedgeListener = DeviceEventEmitter.addListener(
      "dataWedgeBarcode",
      (event: { data: string }) => {
        handleScannedData(event.data);
      }
    );

    return () => {
      isReadyRef.current = false;
      scannerListener.remove();
      zxingListener.remove();
      genericScanListener.remove();
      zebraListener.remove();
      honeywellListener.remove();
      dataWedgeListener.remove();
    };
  }, [onScan, enabled, minLength]);

  return {
    isReady: isReadyRef.current,
    isScanning: isScanningRef.current,
  };
};
