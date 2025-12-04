import express from "express";
import controller from "../staffAttendance/staffAttendance.controller.js";
// import { ensureAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// router.use(ensureAuth);

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.get);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
