import {
  createPlanService,
  listPlansService,
  updatePlanService,
  deletePlanService
} from "./plan.service.js";

export const createPlan = async (req, res, next) => {
  try {
    const plan = await createPlanService(req.body);
    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
};
export const listPlans = async (req, res, next) => {
  try {
    const plans = await listPlansService();
    res.json({ success: true, plans });
  } catch (err) {
    next(err);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const plan = await updatePlanService(id, req.body);
    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await deletePlanService(id);
    res.json({ success: true, message: "Plan deleted" });
  } catch (err) {
    next(err);
  }
};
