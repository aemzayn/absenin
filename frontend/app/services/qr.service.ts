import apiClient from "~/api/client";

export class QrService {
  static async signQrCode(token: string, eventId: number) {
    return await apiClient.get("/v1/qrcode/sign", {
      params: {
        token,
        eventId,
      },
    });
  }
}
