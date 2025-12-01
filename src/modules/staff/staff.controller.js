import {
  createStaffService,
  listStaffService,
  staffDetailService,
} from "./staff.service.js";
import bcrypt from "bcryptjs";

export const createStaff = async (req, res, next) => {
  try {
    const data = req.body;

    // Hash password before creating staff
    data.password = await bcrypt.hash(data.password, 10);

    const staff = await createStaffService(data);

    res.json({
      success: true,
      message: "Staff created successfully",
      staff,
    });
  } catch (err) {
    next(err);
  }
};

export const listStaff = async (req, res, next) => {
  try {
    const branchId = parseInt(req.params.branchId);

    const staff = await listStaffService(branchId);

    res.json({
      success: true,
      staff,
    });
  } catch (err) {
    next(err);
  }
};

export const staffDetail = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const staff = await staffDetailService(id);

    res.json({
      success: true,
      staff,
    });
  } catch (err) {
    next(err);
  }
};
