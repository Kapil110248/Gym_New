// src/modules/branch/branch.controller.js
import {
  createBranchService,
  listBranchesService,
  getBranchByIdService,
  updateBranchService,
  deleteBranchService,
  getBranchByAdminIdService
} from "./branch.service.js";

export const createBranch = async (req, res, next) => {
  try {
    const branch = await createBranchService(req.body);
    res.json({ success: true, branch });
  } catch (err) {
    next(err);
  }
};

export const listBranches = async (req, res, next) => {
  try {
    const branches = await listBranchesService();
    res.json({ success: true, branches });
  } catch (err) {
    next(err);
  }
};

export const getBranchById = async (req, res, next) => {
  try {
    const branch = await getBranchByIdService(req.params.id);
    res.json({ success: true, branch });
  } catch (err) {
    next(err);
  }
};

export const getBranchByAdminId = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const branch = await getBranchByAdminIdService(adminId);

    res.json({
      success: true,
      branch,
    });
  } catch (err) {
    next(err);
  }
};

export const updateBranch = async (req, res, next) => {
  try {
    const branch = await updateBranchService(req.params.id, req.body);
    res.json({ success: true, branch });
  } catch (err) {
    next(err);
  }
};

export const deleteBranch = async (req, res, next) => {
  try {
    const result = await deleteBranchService(req.params.id);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};
