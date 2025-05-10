import { Router } from "express";

import * as controller from "../../controllers/qrcode.controller";
import { query } from "express-validator";
import { validateRequest } from "@/middleware/validate-request";

const router = Router();

router.get(
  "/sign",
  [
    query("token").exists().withMessage("Token is required"),
    query("eventId")
      .exists()
      .withMessage("Event ID is required")
      .isNumeric()
      .withMessage("Event ID must be a number"),
    validateRequest,
  ],
  controller.signQrCode
);

router.get(
  "/:memberId",
  [query("memberId").isNumeric().withMessage("Member ID must be a number")],
  controller.getQRCode
);

export default router;
