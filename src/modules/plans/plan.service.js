import { prisma } from "../../config/db.js";

// ---------------- CREATE PLAN ----------------
export const createPlanService = async (data) => {
  // duration validate
  if (data.duration && !["Monthly", "Yearly"].includes(data.duration)) {
    throw { status: 400, message: "Invalid duration. Allowed: Monthly, Yearly" };
  }

  const allowedFields = [
    "name",
    "price",
    "invoice_limit",
    "additional_invoice_price",
    "user_limit",
    "storage_capacity",
    "billing_cycle",
    "status",
    "description",
    "category",
    "duration"
  ];

  if (!data.name) {
    throw { status: 400, message: "Plan name is required" };
  }

  // Duplicate name check
  const exists = await prisma.plan.findFirst({
    where: { name: data.name }
  });

  if (exists) {
    throw { status: 400, message: "Plan name already exists" };
  }

  // only allowed fields
  const createData = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      createData[key] = data[key];
    }
  }

  // Default status
  if (!createData.status) {
    createData.status = "ACTIVE";
  }

  const plan = await prisma.plan.create({
    data: createData
  });

  return plan;
};

// ---------------- LIST PLANS ----------------
export const listPlansService = async (duration) => {
  const where = {};

  // Optional duration filter
  if (duration && ["Monthly", "Yearly"].includes(duration)) {
    where.duration = duration;
  }

  return prisma.plan.findMany({
    where,
    orderBy: { id: "desc" }
  });
};

// ---------------- UPDATE PLAN ----------------
export const updatePlanService = async (id, data) => {
  // duration validate
  if (data.duration && !["Monthly", "Yearly"].includes(data.duration)) {
    throw { status: 400, message: "Invalid duration. Allowed: Monthly, Yearly" };
  }

  // Check exist
  const existingPlan = await prisma.plan.findUnique({
    where: { id }
  });

  if (!existingPlan) {
    throw { status: 404, message: "Plan not found" };
  }

  // Duplicate name check (if name updated)
  if (data.name) {
    const duplicate = await prisma.plan.findFirst({
      where: {
        name: data.name,
        NOT: { id }
      }
    });

    if (duplicate) {
      throw { status: 400, message: "Plan name already exists" };
    }
  }

  const allowedFields = [
    "name",
    "price",
    "invoice_limit",
    "additional_invoice_price",
    "user_limit",
    "storage_capacity",
    "billing_cycle",
    "status",
    "description",
    "category",
    "duration"
  ];

  const updateData = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      updateData[key] = data[key];
    }
  }

  const updatedPlan = await prisma.plan.update({
    where: { id },
    data: updateData
  });

  return updatedPlan;
};
// ---------------- DELETE PLAN ----------------
export const deletePlanService = async (id) => {
  // Plan exist check
  const existingPlan = await prisma.plan.findUnique({
    where: { id },
    include: { payments: true } // 👈 relation naam agar "payments" hai
  });

  if (!existingPlan) {
    throw { status: 404, message: "Plan not found" };
  }

  // Agar is plan ke against payments hain to delete block karo
  if (existingPlan.payments && existingPlan.payments.length > 0) {
    throw {
      status: 400,
      message:
        "This plan has payments. You cannot delete it. Please mark it as INACTIVE instead."
    };
  }

  // Ab safely delete kar sakte hain (agar koi payment nahi hai)
  return prisma.plan.delete({
    where: { id }
  });
};
