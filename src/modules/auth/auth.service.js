import { prisma } from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";


export const registerUser = async (data) => {
  // destructure safely
  const fullName = data.fullName?.trim();
  const email = data.email?.trim();
  const password = data.password;
  const phone = data.phone?.trim() || null;
  const roleId = data.roleId;
  const branchId = data.branchId || null;

   const gymName = data.gymName || null;
  const address = data.address || null;

  const planName = data.planName || null;
  const price = data.price || null;
  const duration = data.duration || null;
  const description = data.description || null;
  const status = data.status || null;

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

       gymName,
      address,
      
      planName,
      price,
      duration,
      description,
      status,
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



export const fetchUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true, branch: true }
  });

  if (!user) throw { status: 404, message: "User not found" };
  return user;
};

export const modifyUser = async (id, data) => {

  // If password update ho raha ho
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      roleId: data.roleId,
      branchId: data.branchId,

      gymName: data.gymName,
      address: data.address,
      username: data.username,

      planName: data.planName,
      price: data.price,
      duration: data.duration,
      description: data.description,
      status: data.status,

      ...(data.password && { password: data.password }),
    },
    include: { role: true, branch: true }
  });

  return updated;
};

export const removeUser = async (id) => {
  await prisma.user.delete({
    where: { id }
  });
  return true;
};


export const fetchAdmins = async () => {
  const admins = await prisma.user.findMany({
    where: { roleId: 2 },
    include: { role: true, branch: true }
  });

  return admins;
};



export const fetchDashboardStats = async () => {
  // const totalUsers = await prisma.user.count();
  const totalAdmins = await prisma.user.count({ where: { roleId: 2 } });
  const totalBranches = await prisma.branch.count();

  // Example: today’s new users
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const newUsersToday = await prisma.user.count({
    where: {
      createdAt: {
        gte: today
      }
    }
  });

  return {
    // totalUsers,
    totalAdmins,
    totalBranches,
    newUsersToday
  };
};

