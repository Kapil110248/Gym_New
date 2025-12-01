import { prisma } from "../../config/db.js";

export const createDietPlanService = async (data) => {
  const { title, notes, branchId, createdBy, meals } = data;

  return prisma.dietPlan.create({
    data: {
      title,
      notes,
      branchId,
      createdBy,
      meals: {
        create: meals
      }
    },
    include: { meals: true }
  });
};

export const assignDietPlanService = async (memberId, dietPlanId) => {
  return prisma.dietPlanAssignment.create({
    data: { memberId, dietPlanId },
    include: { dietPlan: { include: { meals: true } } },
  });
};

export const getMemberDietPlanService = async (memberId) => {
  return prisma.dietPlanAssignment.findMany({
    where: { memberId },
    orderBy: { id: "desc" },
    include: { dietPlan: { include: { meals: true } } }
  });
};
