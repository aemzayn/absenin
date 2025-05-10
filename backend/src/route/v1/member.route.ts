import { Router } from "express";
const router = Router();

import * as controller from "../../controllers/member.controller";

router.get("/", controller.getMembers);

router.get(
  "/organization/:organizationId",
  controller.getMembersByOrganization
);

router.get("/:id", controller.getMemberById);

router.post("/", controller.registerMember);

router.post("/many-members", controller.registerMembers);

router.put("/:id", controller.updateMember);

router.delete("/:id", controller.deleteMember);

export default router;
