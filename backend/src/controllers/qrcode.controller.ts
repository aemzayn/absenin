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
    const { memberId, eventId } = req.body;
    if (!memberId || !eventId) {
      res.status(400).json({
        error: "Member ID and Event ID are required",
      });
      return;
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        Organization: {
          include: {
            members: {
              where: { id: memberId },
            },
          },
        },
        EventMember: {
          where: { memberId },
          select: {
            id: true,
          },
        },
      },
    });

    if (!event) {
      res.status(404).json({
        error: "Event not found",
      });
      return;
    }

    if (!event.Organization) {
      res.status(404).json({
        error: "Invalid QrCode",
      });
      return;
    }

    if (!event.Organization.members.length) {
      res.status(404).json({
        error: "Member not found in this organization",
      });
      return;
    }

    if (event.EventMember.length > 0) {
      res.status(400).json({
        error: "Member already signed in",
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
      .json({ data: null, message: "Member signed in successfully" });
  } catch (error) {
    next(error);
  }
}
