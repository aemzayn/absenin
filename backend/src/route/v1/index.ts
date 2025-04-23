import { Router } from "express";

import authRouter from "./auth.route";
import memberRouter from "./members.route";
import qrcodeRouter from "./qrcode.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/members", memberRouter);
router.use("/qrcode", qrcodeRouter);

export default router;
