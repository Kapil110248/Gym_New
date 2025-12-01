import { prisma } from "../../config/db.js";

export const getInvoiceDataService = async (paymentId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      member: {
        include: { branch: true },
      },
      plan: true,
    },
  });

  if (!payment) {
    throw { status: 404, message: "Payment / Invoice not found" };
  }

  return payment;
};
