import { prisma } from "../../config/db.js";

function generateInvoiceNo() {
  return "INV-" + Date.now() + "-" + Math.floor(Math.random() * 999);
}

export const recordPaymentService = async (data) => {
  const { memberId, planId, amount } = data;

  // verify member exists
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) throw { status: 404, message: "Member not found" };

  // verify plan exists
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw { status: 404, message: "Plan not found" };

  const payment = await prisma.payment.create({
    data: {
      memberId,
      planId,
      amount,
      invoiceNo: generateInvoiceNo(),
    },
    include: { member: true, plan: true },
  });

  return payment;
};

export const paymentHistoryService = async (memberId) => {
  return prisma.payment.findMany({
    where: { memberId },
    include: { plan: true },
    orderBy: { id: "desc" },
  });
};

export const allPaymentsService = async (branchId) => {
  return prisma.payment.findMany({
    where: { member: { branchId } },
    include: { member: true, plan: true },
    orderBy: { id: "desc" },
  });
};
