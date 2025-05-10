import { Router } from "express";

import * as controller from "@/controllers/event.controller";
import { authMiddleware } from "@/middleware/auth-middleware";
import { param } from "express-validator";
import { validateRequest } from "@/middleware/validate-request";

const router = Router();

router.use(authMiddleware);

router.get("/", controller.getUpcomingEvents);

router.get(
  "/:eventId",
  [
    param("eventId").isNumeric().withMessage("Event ID must be a number"),
    validateRequest,
  ],
  controller.getEvent
);

router.get(
  "/organization/:organizationId",
  [
    param("organizationId")
      .isNumeric()
      .withMessage("Organization ID must be a number"),
    validateRequest,
  ],
  controller.getUpcomingEventsByOrganization
);

router.get("/:eventId/attendees", controller.getEventAttendees);

router.post("/", controller.createEvent);

router.put(
  "/:eventId",
  [
    param("eventId").isNumeric().withMessage("Event ID must be a number"),
    validateRequest,
  ],
  controller.updateEvent
);

router.delete(
  "/:eventId",
  [
    param("eventId").isNumeric().withMessage("Event ID must be a number"),
    validateRequest,
  ],
  controller.deleteEvent
);

export default router;
