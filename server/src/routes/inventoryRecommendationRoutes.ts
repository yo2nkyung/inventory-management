import { Router } from "express";
import { getInventoryRecommendations } from "../controllers/inventoryRecommendationController";

const router = Router();

router.get("/", getInventoryRecommendations);

export default router;
