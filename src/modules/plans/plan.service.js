import { prisma } from "../../config/db.js";

// ---------------- CREATE PLAN ----------------
export const createPlanService = async (data) => {
  // allowed fields (Prisma model के हिसाब से)
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

  // ✅ सिर्फ allowed fields ही भेजेंगे
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
export const listPlansService = async () => {
  return prisma.plan.findMany({
    orderBy: { id: "desc" }
  });
};

// ---------------- UPDATE PLAN ----------------
export const updatePlanService = async (id, data) => {
  // Plan exist check
  const existingPlan = await prisma.plan.findUnique({
    where: { id }
  });

  if (!existingPlan) {
    throw { status: 404, message: "Plan not found" };
  }

  // 🔁 अगर name update कर रहे हो → Duplicate check
  if (data.name) {
    const duplicate = await prisma.plan.findFirst({
      where: {
        name: data.name,
        NOT: { id } // same record को छोड़के
      }
    });

    if (duplicate) {
      throw { status: 400, message: "Plan name already exists" };
    }
  }

  // ✅ सिर्फ valid fields Prisma को भेजेंगे
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
  // Optional: पहले exist check करना हो तो कर सकते हैं
  // const existing = await prisma.plan.findUnique({ where: { id } });
  // if (!existing) throw { status: 404, message: "Plan not found" };

  return prisma.plan.delete({
    where: { id }
  });
};
