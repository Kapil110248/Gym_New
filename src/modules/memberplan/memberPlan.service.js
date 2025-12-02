import { prisma } from "../../config/db.js";

// CREATE
export const saveMemberPlan = async (payload) => {
  return await prisma.memberplan.create({
    data: {
      name: payload.planName,
      sessions: Number(payload.sessions),
      validityDays: Number(payload.validity),
      price: Number(payload.price),
      branchId: Number(payload.branchId),
      type: "GROUP"
    }
  });
};

// GET ALL
export const getAllMemberPlans = async () => {
  return await prisma.memberplan.findMany({
    include: {
      branch: true
    }
  });
};

// GET BY ID
export const getMemberPlanById = async (id) => {
  return await prisma.memberplan.findUnique({
    where: { id },
    include: {
      branch: true
    }
  });
};

// UPDATE
export const updateMemberPlan = async (id, payload) => {
  return await prisma.memberplan.update({
    where: { id },
    data: {
      name: payload.planName,
      sessions: Number(payload.sessions),
      validityDays: Number(payload.validity),
      price: Number(payload.price),
      branchId: Number(payload.branchId)
    }
  });
};


// DELETE
export const deleteMemberPlan = async (id) => {
  return await prisma.memberplan.delete({
    where: { id }
  });
};
