import { prisma } from "../../config/db.js";

// CREATE
export const saveMemberPlan = async (payload) => {
  const { planName, sessions, validity, price, adminId } = payload;

  if (!adminId) {
    throw { status: 400, message: "adminId is required" };
  }

  return await prisma.memberplan.create({
    data: {
      name: planName,
      sessions: Number(sessions),
      validityDays: Number(validity),
      price: Number(price),
      type: "GROUP",
      adminId: Number(adminId),   // ✅ yahan save hoga
    },
  });
};

// GET ALL
// GET ALL – particular admin ke saare plans
// GET ALL – particular admin ke saare plans
export const getAllMemberPlans = async (adminId) => {
  return await prisma.memberplan.findMany({
    where: {
      adminId: Number(adminId),
    },
    // include hata diya, ya sirf admin chahiye to:
    // include: { admin: true },
  });
};

// GET BY ID – sirf id se
export const getMemberPlanById = async (id) => {
  return await prisma.memberplan.findUnique({
    where: { id },
    // include: { admin: true }, // agar admin ka data bhi chahiye ho to
  });
};



// UPDATE
export const updateMemberPlan = async (id, payload) => {
  return await prisma.memberplan.update({
    where: { id },
    data: {
      name: payload.planName,
      sessions: Number(payload.sessions),
      validityDays: Number(payload.validity),
      price: Number(payload.price),
    }
  });
};


// DELETE
export const deleteMemberPlan = async (id) => {
  return await prisma.memberplan.delete({
    where: { id }
  });
};
