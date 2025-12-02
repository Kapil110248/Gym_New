import { prisma } from "../../config/db.js";

export const createBranchService = async ({ name, location, phone, status }) => {
  const exists = await prisma.branch.findFirst({ where: { name } });
  if (exists) throw { status: 400, message: "Branch name already exists" };

  const branch = await prisma.branch.create({
    data: { name, location, phone , status}
  });

  return branch;
};

export const listBranchesService = async () => {
  return prisma.branch.findMany({
    orderBy: { id: "desc" }
  });
};
