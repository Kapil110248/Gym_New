import { prisma } from "../../config/db.js";

// export const createMemberService = async (data) => {
//   const { email, phone } = data;

//   // check duplicate member
//   const exists = await prisma.member.findFirst({
//     where: { OR: [{ email }, { phone }] }
//   });
//   if (exists) throw { status: 400, message: "Member already exists" };



// data.membershipFrom = new Date(data.membershipFrom);
// data.membershipTo = new Date(data.membershipTo);


//   const member = await prisma.member.create({
//     data,
//     include: { plan: true, branch: true },
//   });

//   return member;
// };

// export const listMembersService = async (branchId) => {
//   return prisma.member.findMany({
//     where: { branchId },
//     include: { plan: true },
//     orderBy: { id: "desc" },
//   });
// };






// export const listMembersService = async (branchId, page = 1, limit = 20) => {
//   const skip = (page - 1) * limit;

//   const [items, total] = await Promise.all([
//     prisma.member.findMany({
//       where: { branchId },
//       skip,
//       take: limit,
//       orderBy: { id: "desc" },
//       include: { plan: true }, // jo chahiye
//     }),
//     prisma.member.count({ where: { branchId } }),
//   ]);

//   return {
//     items,
//     total,
//     page,
//     limit,
//     pages: Math.ceil(total / limit),
//   };
// };

// export const memberDetailService = async (id) => {
//   const member = await prisma.member.findUnique({
//     where: { id },
//     include: { plan: true, branch: true },
//   });

//   if (!member) throw { status: 404, message: "Member not found" };

//   return member;
// };


// export const createMemberService = async (data) => {
//   const {
//     email,
//     phone,
//     planId,
//     membershipFrom,
//     dateOfBirth,
//     paymentMode,
//     amountPaid,
//   } = data;

//   // Duplicate Check
//   const exists = await prisma.member.findFirst({
//     where: { OR: [{ email }, { phone }] },
//   });
//   if (exists) throw { status: 400, message: "Member already exists" };

//   // Convert membership start date
//   const startDate = new Date(membershipFrom);

//   let endDate = null;

//   // Auto-calculate membershipTo using plan duration
//   if (planId) {
//     const plan = await prisma.plan.findUnique({ where: { id: planId } });

//     if (!plan) throw { status: 404, message: "Invalid Plan Selected" };

//     // plan.durationDays assumed to be in your Plan table
//     endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + (plan.durationDays || 0));
//   }

//   const member = await prisma.member.create({
//     data: {
//       ...data,
//       membershipFrom: startDate,
//       membershipTo: endDate,
//       paymentMode,
//       amountPaid: Number(amountPaid) || 0,
//     },
//     include: {
//       plan: true,
//       branch: true,
//     },
//   });

//   return member;
// };
export const createMemberService = async (data) => {
  const {
    email,
    password,
    phone,
    planId,
    membershipFrom,
    dateOfBirth,   // add this
    paymentMode,
    amountPaid,
  } = data;

  // Duplicate Check
  const exists = await prisma.member.findFirst({
    where: { OR: [{ email },{password}, { phone }] },
  });
  if (exists) throw { status: 400, message: "Member already exists" };

  // Convert membershipFrom and dateOfBirth to Date objects
  const startDate = new Date(membershipFrom);
  const dob = dateOfBirth ? new Date(dateOfBirth) : null;

  let endDate = null;

  // Auto-calculate membershipTo using plan duration
  if (planId) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw { status: 404, message: "Invalid Plan Selected" };

    // Convert plan.duration to number of days
    const durationDays = Number(plan.duration) || 0;

    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
  }

  const member = await prisma.member.create({
    data: {
      ...data,
      dateOfBirth: dob,           // convert DOB
      membershipFrom: startDate,  // converted start date
      membershipTo: endDate,      // calculated end date
      amountPaid: Number(amountPaid) || 0,
      paymentMode,
    },
    include: {
      plan: true,
      branch: true,
    },
  });

  return member;
};


// export const listMembersService = async (
//   branchId,
//   page = 1,
//   limit = 20,
//   search = ""
// ) => {
//   const skip = (page - 1) * limit;

//   const where = {
//     branchId,
//     OR: [
//       { fullName: { contains: search, mode: "insensitive" } },
//       { phone: { contains: search, mode: "insensitive" } },
//       { email: { contains: search, mode: "insensitive" } },
//     ],
//   };

//   const [items, total] = await Promise.all([
//     prisma.member.findMany({
//       where,
//       skip,
//       take: limit,
//       orderBy: { id: "desc" },
//       include: { plan: true },
//     }),
//     prisma.member.count({ where }),
//   ]);

//   return {
//     items,
//     total,
//     page,
//     limit,
//     pages: Math.ceil(total / limit),
//   };
// };

export const listMembersService = async (
  branchId,
  page = 1,
  limit = 20,
  search = ""
) => {
  const skip = (page - 1) * limit;

  const where = {
    branchId,
    OR: search
      ? [
          { fullName: { contains: search } },
          { phone: { contains: search } },
          { email: { contains: search } },
        ]
      : undefined, // agar search empty ho to OR hata do, warna Prisma error deta hai
  };

  const [items, total] = await Promise.all([
    prisma.member.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: { plan: true },
    }),
    prisma.member.count({ where }),
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
    include: {
      plan: true,
      branch: true,
      payments: true,
      attendances: true,
      bookings: true,
    },
  });

  if (!member) throw { status: 404, message: "Member not found" };
  return member;
};

export const updateMemberService = async (id, data) => {
  const {
    fullName,
    email,
    password,
    phone,
    gender,
    dateOfBirth,
    interestedIn,
    address,
    branchId,
    planId,
    membershipFrom,
    paymentMode,
    amountPaid
  } = data;

  // Email & phone duplicate check
  if (email || phone) {
    const exists = await prisma.member.findFirst({
      where: {
        OR: [{ email }, { phone },{password }],
        NOT: { id }
      }
    });
    if (exists) throw { status: 400, message: "Email or phone already exists" };
  }

  // Calculate membershipTo when plan changes OR membershipFrom changes
  let startDate = membershipFrom ? new Date(membershipFrom) : undefined;
  let endDate = undefined;

  if (planId && startDate) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw { status: 404, message: "Invalid plan selected" };

    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (plan.durationDays || 0));
  }

  const updated = await prisma.member.update({
    where: { id },
    data: {
      fullName,
      email,
      password,
      phone,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      interestedIn,
      address,
      branchId,
      planId,
      membershipFrom: startDate,
      membershipTo: endDate,
      paymentMode,
      amountPaid: amountPaid ? Number(amountPaid) : undefined
    },
    include: {
      plan: true,
      branch: true
    }
  });

  return updated;
};



export const deleteMemberService = async (id) => {
  const member = await prisma.member.update({
    where: { id },
    data: { status: "Inactive" },
  });

  return member;
};
