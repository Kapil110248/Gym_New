import { prisma } from "../../config/db.js";
import { startOfMonth } from "date-fns";

export const dashboardService = async () => {
  const today = new Date();
  const monthStart = startOfMonth(today);

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true }
  });

  const newMembers = await prisma.member.count({
    where: { createdAt: { gte: monthStart } }
  });

  const activeMembers = await prisma.member.count({
    where: { status: "ACTIVE" }
  });

  const checkIns = await prisma.attendance.count({
    where: { createdAt: { gte: monthStart } }
  });

  const ptRevenue = await prisma.payment.aggregate({
    where: { plan: { category: "PT" } },
    _sum: { amount: true }
  });

  const arOverdue = await prisma.member.count({
    where: { expiryDate: { lt: today } }
  });

  // chart: revenue graph for month
  const revenueGraph = await prisma.$queryRaw`
      SELECT DATE(paymentDate) AS day, SUM(amount) AS revenue
      FROM Payment
      WHERE paymentDate >= ${monthStart}
      GROUP BY DATE(paymentDate)
      ORDER BY DATE(paymentDate)
  `;

  // branch leaderboard: revenue + new members
  const branchLeaderboard = await prisma.$queryRaw`
      SELECT 
         b.name AS branch,
         COALESCE(SUM(p.amount), 0) AS revenue,
         COUNT(m.id) AS new
      FROM Branch b
      LEFT JOIN Member m ON m.branchId = b.id AND m.createdAt >= ${monthStart}
      LEFT JOIN Payment p ON p.memberId = m.id
      GROUP BY b.id
      ORDER BY revenue DESC
  `;

  return {
    totalRevenue: totalRevenue._sum.amount || 0,
    newMembers,
    activeMembers,
    checkIns,
    ptRevenue: ptRevenue._sum.amount || 0,
    arOverdue,
    revenueGraph,
    branchLeaderboard,
    dashboardAlerts: [] // Alerts will be added later (Step 11B)
  };
};
