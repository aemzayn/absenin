import { Router } from "express";

import * as controller from "@/controllers/event.controller";
import { authMiddleware } from "@/middleware/auth-middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", controller.getUpcomingEvents);

router.get("/:eventId/attendees", controller.getEventAttendees);

router.post("/", controller.createEvent);

export default router;
