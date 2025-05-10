import QRCode from "qrcode";

export const createQrCode = async (text: string) => {
  try {
    const qrCode = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 1,
    });
    return qrCode;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};
