import { NextFunction, Request, Response } from "express";
import db from "../database";

export async function getDonors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationId = +req.params.organizationId;

    if (isNaN(organizationId)) {
      res.status(400).json({ error: "Invalid organization ID" });
      return;
    }

    // Assuming db is your database instance
    const donors = await db.donor.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });

    res.status(200).json({
      data: donors,
    });
  } catch (error) {
    next(error);
  }
}

export async function createDonor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, organizationId } = req.body;

    if (!name || !organizationId) {
      res.status(400).json({ error: "Name and organization ID are required" });
      return;
    }

    const sameName = await db.donor.findFirst({
      where: {
        name,
        organizationId: +organizationId,
      },
    });

    if (sameName) {
      res
        .status(400)
        .json({ error: "Tidak boleh ada donatur dengan nama yang sama" });
      return;
    }

    const newDonor = await db.donor.create({
      data: {
        name,
        organizationId,
      },
    });

    res.status(201).json({
      data: newDonor,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDonor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const donorId = +req.params.donorId;
    const { name } = req.body;

    if (isNaN(donorId) || !name) {
      res.status(400).json({ error: "Invalid donor ID or name" });
      return;
    }

    const existingDonor = await db.donor.findUnique({
      where: { id: donorId },
    });

    if (!existingDonor) {
      res.status(404).json({ error: "Donor not found" });
      return;
    }

    const sameName = await db.donor.findFirst({
      where: {
        name,
        organizationId: existingDonor.organizationId,
        id: { not: donorId }, // Exclude the current donor
      },
    });

    if (sameName) {
      res
        .status(400)
        .json({ error: "Tidak boleh ada donatur dengan nama yang sama" });
      return;
    }

    const updatedDonor = await db.donor.update({
      where: { id: donorId },
      data: { name },
    });

    res.status(200).json({
      data: updatedDonor,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteDonor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const donorId = +req.params.donorId;

    if (isNaN(donorId)) {
      res.status(400).json({ error: "Invalid donor ID" });
      return;
    }

    await db.donor.delete({
      where: { id: donorId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getDonorById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const donorId = +req.params.donorId;

    if (isNaN(donorId)) {
      res.status(400).json({ error: "Invalid donor ID" });
      return;
    }

    const donor = await db.donor.findUnique({
      where: { id: donorId },
    });

    if (!donor) {
      res.status(404).json({ error: "Donor not found" });
      return;
    }

    res.status(200).json({
      data: donor,
    });
  } catch (error) {
    next(error);
  }
}
