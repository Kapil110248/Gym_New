import { prisma } from "../../config/db.js";
import { startOfMonth } from "date-fns";

export const dashboardService = async () => {
  const today = new Date();
  const monthStart = startOfMonth(today);

  // Total Revenue
  const totalRevenueAgg = await prisma.payment.aggregate({
    _sum: { amount: true }
  });
  const totalRevenue = Number(totalRevenueAgg._sum.amount || 0);

  // New Members This Month
  const newMembers = await prisma.member.count({
    where: { joinDate: { gte: monthStart } }
  });

  // Active Members = membership not expired
  const activeMembers = await prisma.member.count({
    where: { membershipTo: { gte: today } }
  });

  // Check-ins This Month
  const checkIns = await prisma.memberAttendance.count({
    where: { checkIn: { gte: monthStart } }
  });

  // PT Revenue
  const ptRevenueAgg = await prisma.payment.aggregate({
    where: { plan: { is: { category: "PT" } } },
    _sum: { amount: true }
  });
  const ptRevenue = Number(ptRevenueAgg._sum.amount || 0);

  // Overdue Members = membership expired
  const arOverdue = await prisma.member.count({
    where: { membershipTo: { lt: today } }
  });

  // Revenue Graph
  let revenueGraph = await prisma.$queryRaw`
      SELECT DATE(paymentDate) AS day, SUM(amount) AS revenue
      FROM Payment
      WHERE paymentDate >= ${monthStart}
      GROUP BY DATE(paymentDate)
      ORDER BY DATE(paymentDate)
  `;
  revenueGraph = revenueGraph.map(r => ({
    day: r.day,
    revenue: Number(r.revenue)
  }));

  // Branch Leaderboard
  let branchLeaderboard = await prisma.$queryRaw`
      SELECT 
         b.name AS branch,
         COALESCE(SUM(p.amount), 0) AS revenue,
         COUNT(m.id) AS new
      FROM Branch b
      LEFT JOIN Member m 
          ON m.branchId = b.id 
         AND m.joinDate >= ${monthStart}
      LEFT JOIN Payment p 
          ON p.memberId = m.id
      GROUP BY b.id
      ORDER BY revenue DESC
  `;
  branchLeaderboard = branchLeaderboard.map(b => ({
    branch: b.branch,
    revenue: Number(b.revenue),
    new: Number(b.new)
  }));

  return {
    totalRevenue,
    newMembers,
    activeMembers,
    checkIns,
    ptRevenue,
    arOverdue,
    revenueGraph,
    branchLeaderboard,
    dashboardAlerts: []
  };
};
