import { prisma } from "../../config/db.js";

export const createPurchaseService = async (data) => {
  return await prisma.purchase.create({
    data: {
      selectedPlan: data.selectedPlan,
      companyName: data.companyName,
      email: data.email,
      billingDuration: data.billingDuration,
      startDate: new Date(data.startDate)
    }
  });
};

export const getAllPurchasesService = async () => {
  return await prisma.purchase.findMany({
    orderBy: { id: "desc" }
  });
};

export const modifyPurchaseStatus = async (id, status) => {
  if (!status) {
    throw { status: 400, message: "Status is required" };
  }

  const updated = await prisma.purchase.update({
    where: { id },
    data: { status }
  });

  return updated;
};

