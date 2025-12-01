import { Router } from "express";
import { createBranch, listBranches } from "./staff.controller.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = Router();

// Only SUPERADMIN can create branches
router.post(
  "/create",
  verifyToken(["Superadmin","Admin"]),
  createBranch
);

// Superadmin + Admin can view branches
router.get(
  "/",
  verifyToken(["Superadmin", "Admin"]),
  listBranches
);

export default router;
