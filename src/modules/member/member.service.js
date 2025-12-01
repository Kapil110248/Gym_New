import { prisma } from "../../config/db.js";

export const createMemberService = async (data) => {
  const { email, phone } = data;

  // check duplicate member
  const exists = await prisma.member.findFirst({
    where: { OR: [{ email }, { phone }] }
  });
  if (exists) throw { status: 400, message: "Member already exists" };



data.membershipFrom = new Date(data.membershipFrom);
data.membershipTo = new Date(data.membershipTo);


  const member = await prisma.member.create({
    data,
    include: { plan: true, branch: true },
  });

  return member;
};

// export const listMembersService = async (branchId) => {
//   return prisma.member.findMany({
//     where: { branchId },
//     include: { plan: true },
//     orderBy: { id: "desc" },
//   });
// };


export const listMembersService = async (branchId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.member.findMany({
      where: { branchId },
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: { plan: true }, // jo chahiye
    }),
    prisma.member.count({ where: { branchId } }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

export const memberDetailService = async (id) => {
  const member = await prisma.member.findUnique({
    where: { id },
    include: { plan: true, branch: true },
  });

  if (!member) throw { status: 404, message: "Member not found" };

  return member;
};
