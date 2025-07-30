import type { QRCode } from "./qrcode";

export interface Member {
  id: number;
  name: string;
  donorId: number | null;
  image: string | null;
  memberNo: number | null;
  qrcode?: QRCode;
}
