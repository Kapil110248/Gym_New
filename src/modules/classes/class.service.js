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

// export const createScheduleService = async (data) => {
//   return prisma.classSchedule.create({
//     data,
//     include: {
//       classType: true,
//       trainer: true,
//       branch: true,
//     },
//   });
// };






export const createScheduleService = async (data) => {
  const {
    branchId,
    classTypeId,
    trainerId,
    date,
    day,            // <-- NEW FIELD
    startTime,
    endTime,
    capacity,
    status,
    members
  } = data;

  // --- Required validations ---
  if (
    !branchId ||
    !classTypeId ||
    !trainerId ||
    !date ||
    !day ||          // <-- day validation added
    !startTime ||
    !endTime ||
    !capacity
  ) {
    throw new Error("All required fields must be provided.");
  }

  // --- Foreign key validations ---
  const trainerExists = await prisma.user.findUnique({
    where: { id: Number(trainerId) }
  });
  if (!trainerExists) throw new Error("Trainer does not exist.");

  const branchExists = await prisma.branch.findUnique({
    where: { id: Number(branchId) }
  });
  if (!branchExists) throw new Error("Branch does not exist.");

  const classTypeExists = await prisma.classType.findUnique({
    where: { id: Number(classTypeId) }
  });
  if (!classTypeExists) throw new Error("Class type does not exist.");

  // --- Create class schedule ---
  const newSchedule = await prisma.classSchedule.create({
    data: {
      branchId: Number(branchId),
      classTypeId: Number(classTypeId),
      trainerId: Number(trainerId),
      date: new Date(date),
      day,            // <-- saving day here
      startTime,
      endTime,
      capacity: Number(capacity),
      status: status || "Active",
      members: members || [],
    },
  });

  return newSchedule;
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


// export const getAllScheduledClassesService = async () => {

//   const schedules = await prisma.classSchedule.findMany({
//     orderBy: {
//       id: "desc",
//     },

//     include: {
//       classType: true,   // class category info
//       trainer: true,     // trainer details
//       branch: true,      // branch details
//       bookings: true,    // all bookings for that class
//     },
//   });

//   return schedules;
// };

export const getAllScheduledClassesService = async () => {
  const schedules = await prisma.classSchedule.findMany({
    orderBy: { id: "desc" },

    include: {
      classType: true,   // for CLASS NAME
      trainer: true,     // for TRAINER NAME
      branch: true,      // for BRANCH NAME
      bookings: true,
    },
  });

  // Convert to table format
  const formatted = schedules.map((item) => ({
    id: item.id,
    className: item.classType?.name || "N/A",
    trainer: item.trainer?.fullName || "N/A",
    branch: item.branchId || "N/A",
    branchName:item.branch?.name || "N/A",
    date: item.date,
    time: `${item.startTime} - ${item.endTime}`,
    day: item.day,
    status: item.status,
    membersCount: item.members ? item.members.length : 0,
  }));

  return formatted;
};




export const getScheduleByIdService = async (id) => {
  const schedule = await prisma.classSchedule.findUnique({
    where: { id: Number(id) },

    include: {
      classType: true,   // class name
      trainer: true,     // trainer full details
      branch: true,      // branch details
      bookings: true,    // booking list
    },
  });

  if (!schedule) {
    throw new Error("Class schedule not found");
  }

  return schedule;
};

export const updateScheduleService = async (id, data) => {
  const {
    branchId,
    classTypeId,
    trainerId,
    date,
    day,
    startTime,
    endTime,
    capacity,
    status,
    members
  } = data;

  // Check if schedule exists
  const exists = await prisma.classSchedule.findUnique({
    where: { id: Number(id) },
  });

  if (!exists) {
    throw new Error("Class schedule not found");
  }

  // Update schedule
  const updated = await prisma.classSchedule.update({
    where: { id: Number(id) },
    data: {
      branchId: branchId ? Number(branchId) : undefined,
      classTypeId: classTypeId ? Number(classTypeId) : undefined,
      trainerId: trainerId ? Number(trainerId) : undefined,
      date: date ? new Date(date) : undefined,
      day: day ?? undefined,
      startTime: startTime ?? undefined,
      endTime: endTime ?? undefined,
      capacity: capacity ? Number(capacity) : undefined,
      status: status ?? undefined,
      members: members ?? undefined, // array
    },
  });

  return updated;
};

// services/classSchedule.service.js



export const deleteScheduleService = async (id) => {
  const scheduleId = Number(id);

  // check exists
  const existing = await prisma.classSchedule.findUnique({
    where: { id: scheduleId },
  });
  if (!existing) throw new Error("Class schedule not found");

  // delete bookings first then schedule — atomic
  await prisma.$transaction([
    prisma.booking.deleteMany({
      where: { scheduleId }
    }),
    prisma.classSchedule.delete({
      where: { id: scheduleId }
    })
  ]);
 
  return true;
};

