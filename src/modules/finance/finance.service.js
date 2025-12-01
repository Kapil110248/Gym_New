import { prisma } from "../../config/db.js";
import { startOfMonth } from "date-fns";

export const financeReportService = async (branchId) => {
  const monthStart = startOfMonth(new Date());

  // ---------------- REVENUE ----------------
  const revenueAgg = await prisma.payment.aggregate({
    where: { member: { branchId } },
    _sum: { amount: true }
  });

  const monthlyRevenueAgg = await prisma.payment.aggregate({
    where: {
      member: { branchId },
      paymentDate: { gte: monthStart }
    },
    _sum: { amount: true }
  });

  // ---------------- EXPENSES ----------------
  const expenseAgg = await prisma.expense.aggregate({
    where: { branchId },
    _sum: { amount: true }
  });

  const monthlyExpenseAgg = await prisma.expense.aggregate({
    where: {
      branchId,
      date: { gte: monthStart }
    },
    _sum: { amount: true }
  });

  // ---------------- PROFIT ----------------
  const totalRevenue = revenueAgg._sum.amount || 0;
  const totalExpense = expenseAgg._sum.amount || 0;
  const netProfit = totalRevenue - totalExpense;

  const monthlyRevenue = monthlyRevenueAgg._sum.amount || 0;
  const monthlyExpense = monthlyExpenseAgg._sum.amount || 0;
  const monthlyProfit = monthlyRevenue - monthlyExpense;

  // ---------------- GRAPH DATA ----------------
  const revenueGraph = await prisma.$queryRaw`
    SELECT DATE_FORMAT(paymentDate, '%Y-%m') AS month, SUM(amount) AS total
    FROM Payment
    WHERE memberId IN (SELECT id FROM Member WHERE branchId = ${branchId})
    GROUP BY DATE_FORMAT(paymentDate, '%Y-%m')
    ORDER BY month ASC;
  `;

  const expenseGraph = await prisma.$queryRaw`
    SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS total
    FROM Expense
    WHERE branchId = ${branchId}
    GROUP BY DATE_FORMAT(date, '%Y-%m')
    ORDER BY month ASC;
  `;

  return {
    totalRevenue,
    totalExpense,
    netProfit,
    monthlyRevenue,
    monthlyExpense,
    monthlyProfit,
    revenueGraph,
    expenseGraph,
  };
};
    