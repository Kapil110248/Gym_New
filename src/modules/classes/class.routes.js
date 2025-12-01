import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.js";

import {
  createClassType,
  listClassTypes,
  createSchedule,
  listSchedules,
  bookClass,
  cancelBooking,
  memberBookings
} from "./class.controller.js";

const router = Router();

// CLASS TYPES
router.post(
  "/classtype/create",
  verifyToken(["Admin", "Superadmin"]),
  createClassType
);

router.get(
  "/classtype",
  verifyToken(["Admin", "Superadmin", "Staff"]),
  listClassTypes
);

// CLASS SCHEDULE
router.post(
  "/schedule/create",
  verifyToken(["Admin", "Superadmin"]),
  createSchedule
);

router.get(
  "/schedule/branch/:branchId",
  verifyToken(["Admin", "Superadmin", "Staff"]),
  listSchedules
);

// BOOKING
router.post(
  "/book",
  verifyToken(["Admin", "Superadmin", "Staff"]),
  bookClass
);

router.post(
  "/cancel",
  verifyToken(["Admin", "Superadmin", "Staff"]),
  cancelBooking
);

router.get(
  "/member/:memberId",
  verifyToken(["Admin", "Superadmin", "Staff"]),
  memberBookings
);

export default router;
