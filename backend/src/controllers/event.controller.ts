import dayjs from "dayjs";
import { Request, Response, NextFunction } from "express";
import db from "../database";
import config from "../config/config";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getUpcomingEvents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const timezone =
      (req.headers["x-timezone"] as string) || config.DEFAULT_TIMEZONE;

    const today = dayjs().tz(timezone).startOf("day");
    const todayUtc = today.utc().toDate();

    const events = await db.event.findMany({
      where: {
        date: { gte: todayUtc },
        Organization: {
          OrganizationMembership: {
            some: {
              userId: userId,
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    res.status(200).json({ data: events });
  } catch (error) {
    next(error);
  }
}

export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description, date, organizationId, location } = req.body;

    const eventDate = dayjs(date).tz(config.DEFAULT_TIMEZONE).toDate();

    const org = await db.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!org) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    const event = await db.event.create({
      data: {
        name,
        date: eventDate,
        location,
        description,
        Organization: {
          connect: {
            id: organizationId,
          },
        },
      },
    });

    res.status(201).json({ data: event });
  } catch (error) {
    next(error);
  }
}
