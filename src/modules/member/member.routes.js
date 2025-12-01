import { Router } from "express";
import {
  createMember,
  listMembers,
  memberDetail,
} from "./member.controller.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = Router();

/** Only Admin + Staff + Superadmin can create members */
router.post(
  "/create",
  verifyToken(["Superadmin", "Admin", "Staff"]),
  createMember
);

/** List members of a branch */
router.get(
  "/branch/:branchId",
  verifyToken(["Superadmin", "Admin", "Staff"]),
  listMembers
);

/** Member detail */
router.get(
  "/detail/:id",
  verifyToken(["Superadmin", "Admin", "Staff"]),
  memberDetail
);

export default router;
