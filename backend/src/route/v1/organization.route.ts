import e, { Router } from "express";

import * as controller from "../../controllers/organization.controller";
import { authMiddleware } from "../../middleware/auth-middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", controller.getMyOrganizations);

router.get("/:id", controller.getOrganizationById);

router.post("/", controller.createOrganization);

router.put("/:id", controller.updateOrganization);

router.delete("/:id", controller.deleteOrganizationById);

export default router;
