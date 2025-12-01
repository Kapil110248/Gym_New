import { prisma } from "../../config/db.js";

export const createPlanService = async (data) => {
  const exists = await prisma.plan.findFirst({
    where: { name: data.name }
  });

  if (exists) throw { status: 400, message: "Plan name already exists" };

  // Ensure status defaults to ACTIVE if not provided
  const plan = await prisma.plan.create({
    data: {
      ...data,
      status: data.status || "ACTIVE"
    }
  });
  return plan;
};

export const listPlansService = async () => {
  return prisma.plan.findMany({
    orderBy: { id: "desc" }
  });
};

export const updatePlanService = async (id, data) => {
  const plan = await prisma.plan.update({
    where: { id },
    data
  });

  return plan;
};

export const deletePlanService = async (id) => {
  return prisma.plan.delete({
    where: { id },
  });
};
