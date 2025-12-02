import { prisma } from "../../config/db.js";

// export const createStaffService = async ({
//   fullName,
//   email,
//   phone,
//   password,
//   roleId,
//   branchId,
// }) => {
//   // Check if staff already exists
//   const exists = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (exists) {
//     throw { status: 400, message: "Email already exists" };
//   }

//   // Create staff (password already hashed before calling this service)
//   const user = await prisma.user.create({
//     data: {
//       fullName,
//       email,
//       phone,
//       password,
//       roleId,
//       branchId,
//     },
//     include: {
//       role: true,
//       branch: true,
//     },
//   });

//   return user;
// };


export const createStaffService = async ({
  fullName,
  email,
  phone,
  password,
  roleId,
  branchId,
  gender,
  dateOfBirth,
  joinDate,
  exitDate,
  profilePhoto,
}) => {
  // CHECK IF EMAIL EXISTS
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw { status: 400, message: "Email already exists" };

  // CREATE USER + STAFF RELATION
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      password,
      roleId,
      branchId,
      staff: {
        create: {
          gender,
          dateOfBirth: new Date(dateOfBirth),
          joinDate: new Date(joinDate),
          exitDate: exitDate ? new Date(exitDate) : null,
          profilePhoto,
        },
      },
    },
    include: {
      role: true,
      branch: true,
      staff: true,
    },
  });

  return user;
};

// export const listStaffService = async (branchId) => {
//   return prisma.user.findMany({
//     where: { branchId },
//     include: {
//       role: true,
//     },
//     orderBy: {
//       id: "desc",
//     },
//   });
// };

export const listStaffService = async (branchId) => {
  return prisma.user.findMany({
    where: { branchId },
    include: {
      role: true,
      staff: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

// export const staffDetailService = async (id) => {
//   const staff = await prisma.user.findUnique({
//     where: { id },
//     include: {
//       role: true,
//       branch: true,
//     },
//   });

//   if (!staff) {
//     throw { status: 404, message: "Staff not found" };
//   }

//   return staff;
// };


export const staffDetailService = async (id) => {
  const staff = await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
      branch: true,
      staff: true,
    },
  });

  if (!staff) throw { status: 404, message: "Staff not found" };

  return staff;
};


export const updateStaffService = async (id, data) => {
  const {
    fullName,
    email,
    phone,
    roleId,
    branchId,
    gender,
    dateOfBirth,
    joinDate,
    exitDate,
    profilePhoto,
    password
  } = data;

  // If email update → prevent duplicate
  if (email) {
    const exists = await prisma.user.findFirst({
      where: { email, NOT: { id } },
    });
    if (exists) throw { status: 400, message: "Email already exists" };
  }


  // MAIN UPDATE
  const user = await prisma.user.update({
    where: { id },
    data: {
      fullName,
      email,
      phone,
      roleId,
      branchId,
      ...(password && { password }), // update only if provided
      staff: {
        update: {
          gender,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          joinDate: joinDate ? new Date(joinDate) : undefined,
          exitDate: exitDate ? new Date(exitDate) : null,
          ...(profilePhoto && { profilePhoto }),
        },
      },
    },
    include: {
      role: true,
      branch: true,
      staff: true,
    },
  });

  return user;
};

//delete staff service
export const deleteStaffService = async (id) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      status: "Inactive",
      staff: {
        update: {
          status: "Inactive",
          exitDate: new Date(), // auto exit time
        },
      },
    },
  });

  return user;
};

