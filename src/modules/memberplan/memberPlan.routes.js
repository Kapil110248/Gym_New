import { Router } from "express";
import {
  createMemberPlan,
  getMemberPlans,
  getMemberPlan,
  updatePlan,
  deletePlan
} from "../memberplan/memberPlan.controller.js";

const router = Router();

router.get("/", getMemberPlans);          // Get All
router.get("/:id", getMemberPlan);       // Get by ID
router.post("/", createMemberPlan);       // Create
router.put("/:id", updatePlan);          // Update
router.delete("/:id", deletePlan);       // Delete

export default router;
