import QRCode from "qrcode";

/**
 * Genera un código QR como data URL (base64)
 * @param data - Datos a codificar en el QR (generalmente una URL)
 * @param options - Opciones de configuración del QR
 */
export async function generateQRDataUrl(
  data: string,
  options?: {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  const defaultOptions = {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H" as const, // Alta corrección de errores
  };

  const qrOptions = {
    ...defaultOptions,
    ...options,
    color: {
      ...defaultOptions.color,
      ...options?.color,
    },
  };

  try {
    const dataUrl = await QRCode.toDataURL(data, qrOptions);
    return dataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Error al generar el código QR");
  }
}

/**
 * Genera la URL de verificación para un documento
 * @param documentoId - ID del documento
 * @param baseUrl - URL base de la aplicación
 */
export function generateVerificationUrl(
  documentoId: string,
  baseUrl: string
): string {
  // Creamos una URL simple para verificación
  return `${baseUrl}/verificar/${documentoId}`;
}

/**
 * Genera el payload completo del QR incluyendo la URL de verificación
 */
export async function generateDocumentQR(
  documentoId: string,
  baseUrl: string
): Promise<{ qrDataUrl: string; qrPayload: string }> {
  const qrPayload = generateVerificationUrl(documentoId, baseUrl);
  const qrDataUrl = await generateQRDataUrl(qrPayload);

  return {
    qrDataUrl,
    qrPayload,
  };
}


