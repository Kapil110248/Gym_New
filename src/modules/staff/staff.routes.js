import { Router } from "express";
import { createStaff, listStaff, staffDetail } from "./staff.controller.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = Router();

/**
 * Create Staff
 * Only Superadmin & Admin can create new staff
 */
router.post("/create", verifyToken(["Superadmin", "Admin"]), createStaff);

/**
 * List Staff by Branch
 * Admin → only their own branch
 * Superadmin → any branch
 */
router.get(
  "/branch/:branchId",
  verifyToken(["Superadmin", "Admin"]),
  listStaff
);

/**
 * Get Staff Detail by Staff ID
 */
router.get("/detail/:id", verifyToken(["Superadmin", "Admin"]), staffDetail);

export default router;
