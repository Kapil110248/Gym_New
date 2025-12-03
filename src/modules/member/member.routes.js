import { Router } from "express";
import {
  createMember,
  listMembers,
  memberDetail,
  updateMember,
  deleteMember,
  memberDetailByName
} from "./member.controller.js";
import { verifyToken } from "../../middlewares/auth.js";

const router = Router();

/** Only Admin + Staff + Superadmin can create members */
router.post(
  "/create",
  verifyToken(["Superadmin", "Admin", "Staff"]),
  createMember
);

router.put("/update/:id", verifyToken(["Superadmin", "Admin", "Staff"]), updateMember);

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

router.get("/byName/:name", verifyToken(["Superadmin", "Admin", "Staff"]),memberDetailByName);

router.delete("/delete/:id", verifyToken(["Superadmin", "Admin", "Staff"]), deleteMember);

export default router;
