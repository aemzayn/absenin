import { Router } from "express";
const router = Router();

import * as controller from "../../controllers/members.controller";

router.get("/", controller.getMembers);

router.post("/register", controller.registerMembers);

export default router;
