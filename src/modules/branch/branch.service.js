// src/modules/branch/branch.service.js
import { prisma } from "../../config/db.js";

// CREATE
export const createBranchService = async ({ name, address, phone, status }) => {
  if (!name) {
    throw { status: 400, message: "Branch name is required" };
  }

  const exists = await prisma.branch.findFirst({ where: { name } });
  if (exists) {
    throw { status: 400, message: "Branch name already exists" };
  }

  const branch = await prisma.branch.create({
    data: {
      name,
      address: address || null,
      phone: phone || null,
      status: status === "INACTIVE" ? "INACTIVE" : "ACTIVE", // default ACTIVE
    },
  });

  return branch;
};

// LIST (all)
export const listBranchesService = async () => {
  return prisma.branch.findMany({
    orderBy: { id: "desc" },
  });
};

// GET BY ID (view icon)
export const getBranchByIdService = async (id) => {
  const branchId = Number(id);
  if (!branchId) throw { status: 400, message: "Invalid branch id" };

  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
  });

  if (!branch) {
    throw { status: 404, message: "Branch not found" };
  }

  return branch;
};

// UPDATE
export const updateBranchService = async (id, { name, address, phone, status }) => {
  const branchId = Number(id);
  if (!branchId) throw { status: 400, message: "Invalid branch id" };

  // check exists
  const existing = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!existing) throw { status: 404, message: "Branch not found" };

  // unique name check (dusre branch ka same name na ho)
  if (name) {
    const duplicate = await prisma.branch.findFirst({
      where: {
        name,
        NOT: { id: branchId },
      },
    });
    if (duplicate) {
      throw { status: 400, message: "Branch name already exists" };
    }
  }

  const branch = await prisma.branch.update({
    where: { id: branchId },
    data: {
      name: name ?? existing.name,
      address: address ?? existing.address,
      phone: phone ?? existing.phone,
      status: status === "INACTIVE" || status === "ACTIVE" ? status : existing.status,
    },
  });

  return branch;
};

// DELETE (hard delete – trash icon)
export const deleteBranchService = async (id) => {
  const branchId = Number(id);
  if (!branchId) throw { status: 400, message: "Invalid branch id" };

  // ensure exists
  const existing = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!existing) throw { status: 404, message: "Branch not found" };

  await prisma.branch.delete({
    where: { id: branchId },
  });

  return { message: "Branch deleted successfully" };
};
