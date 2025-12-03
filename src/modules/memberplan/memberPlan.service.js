import { prisma } from "../../config/db.js";

// CREATE
export const saveMemberPlan = async (payload) => {
  const { planName, sessions, validity, price, adminId } = payload;

  if (!adminId) {
    throw { status: 400, message: "adminId is required" };
  }

  return await prisma.memberPlan.create({
    data: {
      name: planName,
      sessions: Number(sessions),
      validityDays: Number(validity),
      price: Number(price),
      type: "GROUP",
      adminId: Number(adminId),
    },
  });
};


// GET ALL
// GET ALL – particular admin ke saare plans
// GET ALL – particular admin ke saare plans
export const getAllMemberPlans = async (adminId) => {
  return await prisma.memberPlan.findMany({
    where: {
      adminId: Number(adminId),
    },
    // include hata diya, ya sirf admin chahiye to:
    // include: { admin: true },
  });
};


export const getMemberPlans = async (req, res, next) => {
  try {
    const data = await getAllMemberPlans();
    res.json({ success: true, plans: data });
  } catch (err) {
    next(err);
  }
};


// GET BY ID – sirf id se
export const getMemberPlanById = async (id) => {
  return await prisma.memberPlan.findUnique({
    where: { id },
    // include: { admin: true }, // agar admin ka data bhi chahiye ho to
  });
};



// UPDATE
export const updateMemberPlan = async (id, payload) => {
  return await prisma.memberPlan.update({
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
  return await prisma.memberPlan.delete({
    where: { id }
  });
};
