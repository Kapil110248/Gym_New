import { prisma } from "../../config/db.js";

export const addExpenseService = async (data) => {
  return prisma.expense.create({
    data,
    include: { branch: true },
  });
};

export const listExpensesService = async (branchId, startDate, endDate) => {
  return prisma.expense.findMany({
    where: {
      branchId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { id: "desc" },
  });
};

export const monthlyExpenseSummaryService = async (branchId) => {
  return prisma.$queryRaw`
    SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS total
    FROM Expense
    WHERE branchId = ${branchId}
    GROUP BY DATE_FORMAT(date, '%Y-%m')
    ORDER BY month DESC;
  `;
};
