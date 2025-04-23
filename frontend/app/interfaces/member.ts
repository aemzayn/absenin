import type { QRCode } from "./qrcode";

export interface Member {
  id: number;
  name: string;
  qrcode?: QRCode;
}
