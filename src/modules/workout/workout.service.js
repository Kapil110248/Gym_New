import { prisma } from "../../config/db.js";

export const createWorkoutPlanService = async (data) => {
  const { title, notes, branchId, createdBy, exercises } = data;

  return prisma.workoutPlan.create({
    data: {
      title,
      notes,
      branchId,
      createdBy,
      exercises: { create: exercises }
    },
    include: { exercises: true }
  });
};

export const assignWorkoutPlanService = async (memberId, workoutPlanId) => {
  return prisma.workoutPlanAssignment.create({
    data: { memberId, workoutPlanId },
    include: { workoutPlan: { include: { exercises: true } } },
  });
};

export const getMemberWorkoutPlanService = async (memberId) => {
  return prisma.workoutPlanAssignment.findMany({
    where: { memberId },
    include: { workoutPlan: { include: { exercises: true } } },
    orderBy: { id: "desc" },
  });
};
