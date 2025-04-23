import { NextFunction, Request, Response } from "express";
import db from "../database";

export async function getQRCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const memberId = +req.params.memberId;
    const qrcode = await db.qrcode.findUnique({
      where: { memberId },
    });

    if (!qrcode) {
      res.status(404).json({
        error: "QRCode not found",
      });
      return;
    }

    res.json({ data: qrcode });
  } catch (error) {
    next(error);
  }
}
