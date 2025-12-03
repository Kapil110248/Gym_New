import { Router } from "express";
import {
  createMemberPlan,
  getMemberPlans,
  getMemberPlan,
  updatePlan,
  deletePlan
} from "../memberplan/memberPlan.controller.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = Router();

// ✅ saare member plan routes sirf Admin (ya Superadmin) ke liye
router.use(verifyToken(["Admin", "Superadmin"]));

router.get("/", getMemberPlans);          // Get All (current admin ke according)
router.get("/:id", getMemberPlan);       // Get by ID (current admin ka hi)
router.post("/", createMemberPlan);      // Create
router.put("/:id", updatePlan);          // Update
router.delete("/:id", deletePlan);       // Delete

export default router;
