import { Router } from "express";
import memberRouter from "./members.route";

const router = Router();

router.use("/members", memberRouter);

export default router;
