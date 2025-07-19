import { Router } from "express";
const router = Router();

import * as controller from "../../controllers/donor.controller";

router.get("/list/:organizationId", controller.getDonors);

router.get("/:donorId", controller.getDonorById);

router.post("/", controller.createDonor);

router.put("/:donorId", controller.updateDonor);

router.delete("/:donorId", controller.deleteDonor);

export default router;
