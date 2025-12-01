import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";

// export const registerUser = async (data) => {
//   const { fullName, email, password, phone, roleId, branchId } = data;

//   // check user exists
//   const exist = await prisma.user.findUnique({ where: { email } });
//   if (exist) throw { status: 400, message: "Email already registered" };

//   // hash password
//   const hash = await bcrypt.hash(password, 10);

//   const user = await prisma.user.create({
//     data: {
//       fullName,
//       email,
//       phone,
//       password: hash,
//       roleId,
//       branchId: branchId || null,
//     },
//     include: { role: true, branch: true },
//   });

//   return user;
// };





export const registerUser = async (data) => {
  // destructure safely
  const fullName = data.fullName?.trim();
  const email = data.email?.trim();
  const password = data.password;
  const phone = data.phone?.trim() || null;
  const roleId = data.roleId;
  const branchId = data.branchId || null;

  // Validate required fields
  if (!fullName || !email || !password || !roleId) {
    throw { status: 400, message: "fullName, email, password, and roleId are required" };
  }

  // check if user exists
  const exist = await prisma.user.findUnique({
    where: { email },
  });
  if (exist) throw { status: 400, message: "Email already registered" };

  // hash password
  const hash = await bcrypt.hash(password, 10);

  // create user
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hash,
      phone,
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

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true, branch: true },
  });

  if (!user) throw { status: 400, message: "User not found" };

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: "Invalid password" };

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role.name,
      branchId: user.branchId,
    },
    ENV.jwtSecret,
    { expiresIn: "7d" }
  );

  return { token, user };
};
