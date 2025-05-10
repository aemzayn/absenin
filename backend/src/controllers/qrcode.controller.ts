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

export async function signQrCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.query.token as string;
    if (!req.query.eventId) {
      res.status(400).json({
        error: "Event ID is required",
      });
      return;
    }
    const eventId = +req.query.eventId as number;

    const qrcode = await db.qrcode.findUnique({
      where: { token },
      include: {
        member: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!qrcode) {
      res.status(400).json({
        error: "QR Code tidak valid",
      });
      return;
    }

    const memberId = qrcode.member.id;

    const event = await db.event.findUnique({
      where: { id: +eventId },
      include: {
        EventMember: {
          where: {
            memberId,
          },
        },
      },
    });

    if (!event) {
      res.status(400).json({
        error: "QR Code tidak valid",
      });
      return;
    }

    if (event.EventMember.length > 0) {
      res.status(400).json({
        error: "Peserta sudah melakukan absensi",
      });
      return;
    }

    // create a new EventMember
    await db.eventMember.create({
      data: {
        eventId,
        memberId,
      },
    });

    res
      .status(200)
      .json({ data: null, message: "QR Code berhasil diverifikasi" });
  } catch (error) {
    next(error);
  }
}
