import type { Product } from "../types/inventory";

export interface LabelConfig {
  labelWidth: number;
  labelHeight: number;
  qrCodeSize: number;
  fontSize: number;
  margin: number;
}

export interface PrinterConnection {
  type: "bluetooth" | "wifi" | "usb";
  address?: string; // For Bluetooth MAC address or IP address
  port?: number; // For network printers
}

export class ZebraLabelService {
  private static defaultConfig: LabelConfig = {
    labelWidth: 300, // dots (2 inches at 150 DPI)
    labelHeight: 200, // dots
    qrCodeSize: 100, // dots
    fontSize: 10,
    margin: 10,
  };

  /**
   * Generates ZPL (Zebra Programming Language) code for a product QR label
   */
  static generateProductLabel(
    product: Product,
    config: LabelConfig = this.defaultConfig
  ): string {
    const { qrCodeSize, fontSize, margin } = config;

    // Create QR code data - typically includes product code or barcode
    const qrData = product.codigoBarra || product.codigo;

    // Calculate positions
    const qrX = margin;
    const qrY = margin;
    const textStartX = qrX + qrCodeSize + margin;
    const textStartY = qrY;

    // Build ZPL command
    const zpl = `
^XA
^CF0,${fontSize}
^FO${qrX},${qrY}^BQN,2,${qrCodeSize}^FDMM,${qrData}^FS
^FO${textStartX},${textStartY}^FD${this.truncateText(product.nombre, 25)}^FS
^FO${textStartX},${textStartY + fontSize + 5}^FDCódigo: ${product.codigo}^FS
^FO${textStartX},${textStartY + (fontSize + 5) * 2}^FDBarcode: ${
      product.codigoBarra
    }^FS
^FO${textStartX},${
      textStartY + (fontSize + 5) * 3
    }^FDPrecio: $${product.precio1.toFixed(2)}^FS
^FO${textStartX},${textStartY + (fontSize + 5) * 4}^FDÁrea: ${this.truncateText(
      product.area,
      15
    )}^FS
^FO${textStartX},${textStartY + (fontSize + 5) * 5}^FDDpto: ${this.truncateText(
      product.departamento,
      15
    )}^FS
^XZ
`.trim();

    return zpl;
  }

  /**
   * Truncates text to fit within label constraints
   */
  private static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  }

  /**
   * Validates printer connection
   */
  static async validatePrinterConnection(
    connection: PrinterConnection
  ): Promise<boolean> {
    try {
      switch (connection.type) {
        case "bluetooth":
          // For React Native, you would use a Bluetooth library like react-native-bluetooth-classic
          return await this.validateBluetoothConnection(
            connection.address || ""
          );
        case "wifi":
          return await this.validateWifiConnection(
            connection.address || "",
            connection.port || 9100
          );
        case "usb":
          // USB connections are typically handled by the OS/platform
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error("Printer validation error:", error);
      return false;
    }
  }

  /**
   * Validates Bluetooth printer connection
   */
  private static async validateBluetoothConnection(
    address: string
  ): Promise<boolean> {
    // This would require a Bluetooth library implementation
    // For now, we'll return true as a placeholder
    console.log("Validating Bluetooth connection to:", address);
    return true;
  }

  /**
   * Validates WiFi printer connection
   */
  private static async validateWifiConnection(
    address: string,
    port: number
  ): Promise<boolean> {
    try {
      // In React Native, you might use a TCP socket library
      // For now, we'll simulate a basic connectivity check
      console.log("Validating WiFi connection to:", `${address}:${port}`);
      return true;
    } catch (error) {
      console.error("WiFi printer connection error:", error);
      return false;
    }
  }

  /**
   * Sends ZPL data to printer
   */
  static async printLabel(
    zplData: string,
    connection: PrinterConnection
  ): Promise<{ success: boolean; message: string }> {
    try {
      const isConnected = await this.validatePrinterConnection(connection);
      if (!isConnected) {
        return {
          success: false,
          message: "No se pudo conectar con la impresora",
        };
      }

      switch (connection.type) {
        case "bluetooth":
          return await this.printViaBluetooth(
            zplData,
            connection.address || ""
          );
        case "wifi":
          return await this.printViaWifi(
            zplData,
            connection.address || "",
            connection.port || 9100
          );
        case "usb":
          return await this.printViaUSB(zplData);
        default:
          return { success: false, message: "Tipo de conexión no soportado" };
      }
    } catch (error: any) {
      console.error("Print error:", error);
      return { success: false, message: error.message || "Error al imprimir" };
    }
  }

  /**
   * Prints via Bluetooth connection
   */
  private static async printViaBluetooth(
    zplData: string,
    address: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // This would require react-native-bluetooth-classic or similar
      // For now, we'll simulate the print operation
      console.log("Printing via Bluetooth to:", address);
      console.log("ZPL Data:", zplData);

      // Simulate printing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return {
        success: true,
        message: "Etiqueta enviada a impresora Bluetooth",
      };
    } catch (error: any) {
      return { success: false, message: `Error Bluetooth: ${error.message}` };
    }
  }

  /**
   * Prints via WiFi connection
   */
  private static async printViaWifi(
    zplData: string,
    address: string,
    port: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      // In React Native, you would use a TCP socket library like react-native-tcp-socket
      // For now, we'll simulate the operation
      console.log("Printing via WiFi to:", `${address}:${port}`);
      console.log("ZPL Data:", zplData);

      // Simulate printing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return { success: true, message: "Etiqueta enviada a impresora WiFi" };
    } catch (error: any) {
      return { success: false, message: `Error WiFi: ${error.message}` };
    }
  }

  /**
   * Prints via USB connection
   */
  private static async printViaUSB(
    zplData: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // USB printing would typically be handled by the platform
      console.log("Printing via USB");
      console.log("ZPL Data:", zplData);

      // Simulate printing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return { success: true, message: "Etiqueta enviada a impresora USB" };
    } catch (error: any) {
      return { success: false, message: `Error USB: ${error.message}` };
    }
  }

  /**
   * Gets available printers (mock implementation)
   */
  static async getAvailablePrinters(): Promise<PrinterConnection[]> {
    // This would integrate with platform-specific printer discovery
    // For now, return mock data
    return [
      { type: "bluetooth", address: "00:11:22:33:44:55" },
      { type: "wifi", address: "192.168.1.100", port: 9100 },
      { type: "usb" },
    ];
  }

  /**
   * Previews ZPL as text (for debugging)
   */
  static previewLabel(product: Product, config?: LabelConfig): string {
    return this.generateProductLabel(product, config);
  }
}
