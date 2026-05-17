import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ecoRouter from "./eco";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ecoRouter);

export default router;
