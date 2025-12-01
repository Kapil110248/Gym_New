import { prisma } from "../../config/db.js";

export const createStaffService = async ({
  fullName,
  email,
  phone,
  password,
  roleId,
  branchId,
}) => {
  // Check if staff already exists
  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    throw { status: 400, message: "Email already exists" };
  }

  // Create staff (password already hashed before calling this service)
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      password,
      roleId,
      branchId,
    },
    include: {
      role: true,
      branch: true,
    },
  });

  return user;
};

export const listStaffService = async (branchId) => {
  return prisma.user.findMany({
    where: { branchId },
    include: {
      role: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const staffDetailService = async (id) => {
  const staff = await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
      branch: true,
    },
  });

  if (!staff) {
    throw { status: 404, message: "Staff not found" };
  }

  return staff;
};
