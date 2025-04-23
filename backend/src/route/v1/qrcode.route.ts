import { Router } from "express";

import * as controller from "../../controllers/qrcode.controller";

const router = Router();

router.get("/:memberId", controller.getQRCode);

export default router;
