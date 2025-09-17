import { Router } from "express";

import apiaryRoutes from "./apiaryRoutes";
import hiveRoutes from "./hiveRoutes";

const router = Router();


router.use("/apiaries", apiaryRoutes);
router.use("/hives", hiveRoutes);


export default router;