import { Router } from "express";
import memberRouter from "./members.route";
import qrcodeRouter from "./qrcode.route";

const router = Router();

router.use("/members", memberRouter);
router.use("/qrcode", qrcodeRouter);

export default router;
