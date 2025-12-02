import {
  saveMemberPlan,
  getAllMemberPlans,
  getMemberPlanById,
  updateMemberPlan,
  deleteMemberPlan
} from "../memberplan/memberPlan.service.js";

export const createMemberPlan = async (req, res, next) => {
  try {
    const data = await saveMemberPlan(req.body);
    res.json({ success: true, plan: data });
  } catch (err) {
    next(err);
  }
};

export const getMemberPlans = async (req, res, next) => {
  try {
    const data = await getAllMemberPlans();
    res.json({ success: true, plans: data });
  } catch (err) {
    next(err);
  }
};

export const getMemberPlan = async (req, res, next) => {
  try {
    const data = await getMemberPlanById(Number(req.params.id));
    res.json({ success: true, plan: data });
  } catch (err) {
    next(err);
  }
};


export const updatePlan = async (req, res, next) => {
  try {
    const data = await updateMemberPlan(Number(req.params.id), req.body);

    res.json({
      success: true,
      message: "Plan updated successfully",
      plan: data
    });
  } catch (err) {
    next(err);
  }
};


export const deletePlan = async (req, res, next) => {
  try {
    await deleteMemberPlan(Number(req.params.id));
    res.json({ success: true, message: "Plan deleted successfully" });
  } catch (err) {
    next(err);
  }
};
