import { NextFunction, Request, Response } from "express";
import QRCode from "qrcode";

export function getMembers(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({
      data: [],
    });
  } catch (error) {
    next(error);
  }
}

export async function registerMembers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const members = req.body;

    if (!members || !Array.isArray(members)) {
      return res.status(400).json({
        error: "Invalid input data",
      });
    }

    const data = [];
    for (const member of members) {
      const { name, email } = member;
      const id = Math.floor(Math.random() * 1000);
      const qrCodeData = {
        id,
        name,
        email,
      };
      const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));
      data.push({
        id,
        name,
        email,
        qrCode,
      });
    }

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
}
