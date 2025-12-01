import { prisma } from "../../config/db.js";

export const generateAlerts = async () => {
  const today = new Date();
  const soon = new Date();
  soon.setDate(today.getDate() + 3); // 3-day pre-expiry alerts

  // Clear old alerts (optional)
  await prisma.alert.deleteMany();

  const expiring = await prisma.member.findMany({
    where: {
      membershipTo: {
        gte: today,
        lte: soon,
      },
    },
  });

  const expired = await prisma.member.findMany({
    where: {
      membershipTo: {
        lt: today,
      },
    },
  });

  const noPayment = await prisma.member.findMany({
    where: {
      planId: null,
    },
  });

  // Insert Alerts
  for (const m of expiring) {
    await prisma.alert.create({
      data: {
        type: "EXPIRING",
        message: `${m.fullName}'s membership expires soon`,
        memberId: m.id,
        branchId: m.branchId,
      },
    });
  }

  for (const m of expired) {
    await prisma.alert.create({
      data: {
        type: "EXPIRED",
        message: `${m.fullName}'s membership has expired`,
        memberId: m.id,
        branchId: m.branchId,
      },
    });
  }

  for (const m of noPayment) {
    await prisma.alert.create({
      data: {
        type: "NO_PAYMENT",
        message: `${m.fullName} has no payment recorded`,
        memberId: m.id,
        branchId: m.branchId,
      },
    });
  }

  return true;
};
