import type { NextFunction, Request, Response } from "express";
import db from "../database";

export async function getMyOrganizations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    const organizations = await db.organization.findMany({
      where: {
        OrganizationMembership: {
          some: {
            userId: userId,
          },
        },
      },
    });

    res.status(200).json({ data: organizations });
  } catch (error) {
    next(error);
  }
}

export async function createOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const { name, address, email, phone, website } = req.body;

    const sameNameOrganization = await db.organization.findFirst({
      where: {
        name,
      },
    });

    if (sameNameOrganization) {
      res.status(400).json({
        error: "Organization with the same name already exists",
      });
      return;
    }

    const organization = await db.organization.create({
      data: {
        name,
        address,
        email,
        phone,
        website,
        OrganizationMembership: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
    });

    res.status(201).json({ data: organization });
  } catch (error) {
    next(error);
  }
}

export async function updateOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = +req.params.id;
    const { name, address, email, phone, website } = req.body;

    const sameNameOrganization = await db.organization.findFirst({
      where: {
        name,
        id: {
          not: id,
        },
      },
    });

    if (sameNameOrganization) {
      res.status(400).json({
        error: "Organization with the same name already exists",
      });
      return;
    }

    const organization = await db.organization.update({
      where: { id },
      data: {
        name,
        address,
        email,
        phone,
        website,
      },
    });

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    res.status(200).json({ data: organization });
  } catch (error) {
    next(error);
  }
}
