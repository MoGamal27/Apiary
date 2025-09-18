import { Router } from "express";

import apiaryRoutes from "./apiaryRoutes";
import hiveRoutes from "./hiveRoutes";
import inspectionRoutes from "./inspectionRoutes"
import taskRoutes from "./taskRoutes"
import feedingRoutes from "./feedingRoutes"
import harvestRoutes from "./harvestRoutes"
import treatmentRoutes from "./treatmentRoutes"

const router = Router();


router.use("/apiaries", apiaryRoutes);
router.use("/hives", hiveRoutes);
router.use("/inspections", inspectionRoutes)
router.use("/tasks", taskRoutes)
router.use("/feedings", feedingRoutes)
router.use("/harvests", harvestRoutes)
router.use("/treatments", treatmentRoutes)

export default router;