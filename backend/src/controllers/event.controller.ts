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
      include: {
        Organization: {
          select: {
            id: true,
            name: true,
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

export async function getUpcomingEventsByOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationId = +req.params.organizationId;
    const userId = req.user!.id;
    const timezone =
      (req.headers["x-timezone"] as string) || config.DEFAULT_TIMEZONE;

    const today = dayjs().tz(timezone).startOf("day");
    const todayUtc = today.utc().toDate();

    const events = await db.event.findMany({
      where: {
        date: { gte: todayUtc },
        Organization: {
          id: organizationId,
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

export async function getEventAttendees(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const eventId = req.params.eventId;

    const event = await db.event.findUnique({
      where: {
        id: +eventId,
      },
      include: {
        Organization: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const attendees = await db.eventMember.findMany({
      where: {
        eventId: +eventId,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            EventMember: {
              select: {
                createdAt: true,
              },
            },
          },
        },
      },
    });

    const attendeedIds: { [key: number]: boolean } = {};
    for (const attendee of attendees) {
      console.log(attendee);
      attendeedIds[attendee.memberId] = true;
    }

    const members = event.Organization?.members ?? [];

    const allMembers = [];
    for (const member of members) {
      const attended = attendeedIds[member.id] || false;
      allMembers.push({
        ...member,
        attended,
      });
    }

    // order by the attended status and name
    allMembers.sort((a, b) => {
      if (a.attended && !b.attended) return -1;
      if (!a.attended && b.attended) return 1;
      return a.name.localeCompare(b.name);
    });

    res.status(200).json({
      data: allMembers,
    });
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
