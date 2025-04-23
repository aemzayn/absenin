import { Router } from "express";

import authRouter from "./auth.route";
import memberRouter from "./member.route";
import organizationRouter from "./organization.route";
import qrcodeRouter from "./qrcode.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/members", memberRouter);
router.use("/organizations", organizationRouter);
router.use("/qrcode", qrcodeRouter);

export default router;
