import { prisma } from "../../config/db.js";

// --- MEMBER CHECK-IN ---
export const memberCheckInService = async (memberId, branchId) => {
  // check active membership
  const member = await prisma.member.findUnique({ where: { id: memberId } });

  if (!member) throw { status: 404, message: "Member not found" };

  if (!member.membershipFrom || !member.membershipTo)
    throw { status: 400, message: "Membership not assigned" };

  const now = new Date();

  // membership validity check    
  if (now < member.membershipFrom || now > member.membershipTo)
    throw { status: 400, message: "Membership expired or not active" };
  
  // prevent double check-in
  const active = await prisma.memberAttendance.findFirst({
    where: { memberId, checkOut: null },
  });

  if (active)
    throw { status: 400, message: "Member already checked in" };

  return prisma.memberAttendance.create({
    data: { memberId, branchId }
  });
};

// --- MEMBER CHECK-OUT ---
export const memberCheckOutService = async (memberId) => {
  const active = await prisma.memberAttendance.findFirst({
    where: { memberId, checkOut: null },
  });

  if (!active)
    throw { status: 400, message: "Member not checked in" };

  return prisma.memberAttendance.update({
    where: { id: active.id },
    data: { checkOut: new Date() }
  });
};

// --- MEMBER ATTENDANCE LIST ---
export const memberAttendanceListService = async (memberId) => {
  return prisma.memberAttendance.findMany({
    where: { memberId },
    orderBy: { id: "desc" },
  });
};

// ===== STAFF ATTENDANCE =====

export const staffCheckInService = async (staffId, branchId) => {
  const active = await prisma.staffAttendance.findFirst({
    where: { staffId, checkOut: null },
  });

  if (active)
    throw { status: 400, message: "Staff already checked in" };

  return prisma.staffAttendance.create({
    data: { staffId, branchId }
  });
};

export const staffCheckOutService = async (staffId) => {
  const active = await prisma.staffAttendance.findFirst({
    where: { staffId, checkOut: null },
  });

  if (!active)
    throw { status: 400, message: "Staff not checked in" };

  return prisma.staffAttendance.update({
    where: { id: active.id },
    data: { checkOut: new Date() }
  });
};

export const staffAttendanceListService = async (staffId) => {
  return prisma.staffAttendance.findMany({
    where: { staffId },
    orderBy: { id: "desc" },
  });
};
