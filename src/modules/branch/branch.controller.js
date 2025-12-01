import {
  createBranchService,
  listBranchesService,
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
