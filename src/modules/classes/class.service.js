import { prisma } from "../../config/db.js";

// ===== CLASS TYPES =====

export const createClassTypeService = async (name) => {
  const exists = await prisma.classType.findFirst({ where: { name } });
  if (exists) throw { status: 400, message: "Class type exists" };

  return prisma.classType.create({ data: { name } });
};

export const listClassTypesService = async () => {
  return prisma.classType.findMany({
    orderBy: { id: "desc" }
  });
};

// ===== CLASS SCHEDULE =====

export const createScheduleService = async (data) => {
  return prisma.classSchedule.create({
    data,
    include: {
      classType: true,
      trainer: true,
      branch: true,
    },
  });
};

export const listSchedulesService = async (branchId) => {
  return prisma.classSchedule.findMany({
    where: { branchId },
    include: { classType: true, trainer: true },
    orderBy: { date: "asc" },
  });
};

// ===== BOOKING =====

export const bookClassService = async (memberId, scheduleId) => {
  const existing = await prisma.booking.findFirst({
    where: { memberId, scheduleId },
  });

  if (existing)
    throw { status: 400, message: "Already booked for this class" };

  const schedule = await prisma.classSchedule.findUnique({
    where: { id: scheduleId },
    include: { bookings: true },
  });

  if (!schedule) throw { status: 404, message: "Schedule not found" };

  // Check capacity
  if (schedule.bookings.length >= schedule.capacity)
    throw { status: 400, message: "Class is full" };

  return prisma.booking.create({
    data: { memberId, scheduleId },
  });
};

export const cancelBookingService = async (memberId, scheduleId) => {
  const existing = await prisma.booking.findFirst({
    where: { memberId, scheduleId },
  });

  if (!existing)
    throw { status: 400, message: "No booking found" };

  return prisma.booking.delete({
    where: { id: existing.id },
  });
};

export const memberBookingsService = async (memberId) => {
  return prisma.booking.findMany({
    where: { memberId },
    include: {
      schedule: {
        include: { classType: true, trainer: true }
      }
    },
    orderBy: { id: "desc" }
  });
};
