import { NextFunction, Request, Response } from "express";
import QRCode from "qrcode";
import db from "../database";
import { createQrCode } from "../utils/create-qr";
import { nanoid } from "nanoid";

export async function getMembers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationId = req.query.organizationId;
    if (!organizationId) {
      res.status(400).json({
        error: "Organization ID is required",
      });
      return;
    }

    const members = await db.member.findMany({
      include: {
        qrcode: true,
        donor: true,
      },
      where: {
        organizationId: +organizationId,
      },
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json({
      data: members,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMemberById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = +req.params.id;
    const member = await db.member.findUnique({
      where: { id },
    });

    if (!member) {
      res.status(404).json({
        error: "Member not found",
      });
      return;
    }

    res.json({ data: member });
  } catch (error) {
    next(error);
  }
}

export async function createMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const member = req.body.member;
    const organizationId = req.body.organizationId;

    const organization = await db.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      res.status(404).json({
        error: "Organization not found",
      });
      return;
    }

    const sameName = await db.member.findFirst({
      where: {
        name: member.name,
        organizationId,
      },
    });

    if (sameName) {
      res.status(400).json({
        error: "Tidak bisa membuat anggota dengan nama yang sama",
      });
      return;
    }

    const createdMember = await db.member.create({
      data: {
        name: member.name,
        organizationId,
        donorId: member.donorId,
        memberNo: member.memberNo,
        image: member.image,
      },
    });

    const token = nanoid(8);

    const qrCode = await createQrCode(token);

    await db.qrcode.create({
      data: {
        memberId: createdMember.id,
        qrcode: qrCode,
        token,
      },
    });

    const memberWithQRCode = await db.member.findUnique({
      where: {
        id: createdMember.id,
      },
      include: {
        qrcode: true,
        donor: true,
      },
    });

    res.status(201).json({
      data: memberWithQRCode,
      message: "Member registered successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function createManyMembers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const members = req.body.members;
    const organizationId = req.body.organizationId;

    if (!members || !Array.isArray(members)) {
      res.status(400).json({
        error: "Invalid input data",
      });
      return;
    }

    const createdMembers = await db.member.createManyAndReturn({
      data: members.map((member) => ({
        name: member.name,
        organizationId,
        donorId: member.donorId,
        memberNo: member.memberNo,
      })),
    });

    // create qrcode
    const qrCodes = [];
    const memberIds = [];

    for (const member of createdMembers) {
      const token = nanoid(8);
      const qrCode = await QRCode.toDataURL(token, {
        errorCorrectionLevel: "H", // high error correction
        margin: 1, // reduce margin to 1
        width: 500, // resolution to 500x500
      });
      qrCodes.push({
        memberId: member.id,
        qrcode: qrCode,
        token,
      });
      memberIds.push(member.id);
    }

    // save qrcode to db
    await db.qrcode.createMany({
      data: qrCodes,
    });

    const memberWithQRCode = await db.member.findMany({
      where: {
        id: {
          in: memberIds,
        },
      },
      include: {
        qrcode: true,
      },
    });

    res.status(201).json({
      data: memberWithQRCode,
      message: "Members registered successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = +req.params.id;
    const member = await db.member.findUnique({
      where: { id },
    });

    if (!member) {
      res.status(404).json({
        error: "Member not found",
      });
      return;
    }

    const sameName = await db.member.findFirst({
      where: {
        name: req.body.name,
        organizationId: member.organizationId,
        id: {
          not: id, // exclude current member
        },
      },
    });

    if (sameName) {
      res.status(400).json({
        error: "Tidak bisa mengubah nama anggota menjadi nama yang sudah ada",
      });
      return;
    }

    const updatedMember = await db.member.update({
      where: { id },
      data: {
        name: req.body.name,
        donorId: req.body.donorId,
        memberNo: req.body.memberNo,
        image: req.body.image,
      },
      include: {
        qrcode: true,
        donor: true,
      },
    });

    res.json({ data: updatedMember });
  } catch (error) {
    next(error);
  }
}

export async function deleteMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = +req.params.id;
    const member = await db.member.findUnique({
      where: { id },
    });

    if (!member) {
      res.status(404).json({
        error: "Member not found",
      });
      return;
    }

    await db.member.delete({
      where: { id },
      include: {
        qrcode: true,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
