import { prisma } from "../../config/db.js";


// ➤ Create Session
export const createSessionService = async (data) => {
  return await prisma.session.create({
    data: {
      sessionName: data.sessionName,
      trainerId: Number(data.trainerId),
      branchId: Number(data.branchId),
      date: new Date(data.date),
      time: data.time,
      duration: Number(data.duration),
      description: data.description,
      status: data.status || "Upcoming",
    },
  });
};

// ➤ List Sessions (with search + upcoming first)
export const listSessionsService = async (branchId, search) => {
  return await prisma.session.findMany({
    where: {
      branchId: Number(branchId),
      sessionName: {
        contains: search || "",
      
      },
    },
    orderBy: [
      { status: "asc" },
      { date: "asc" },
      { time: "asc" },
    ],
    include: {
      trainer: { select: { id: true, fullName: true } },
      branch: { select: { id: true, name: true } },
    },
  });
};

// ➤ Update complete session (edit session modal)
export const updateSessionService = async (sessionId, data) => {
  return await prisma.session.update({
    where: { id: Number(sessionId) },
    data: {
      sessionName: data.sessionName,
      trainerId: Number(data.trainerId),
      branchId: Number(data.branchId),
      date: new Date(data.date),
      time: data.time,
      duration: Number(data.duration),
      description: data.description,
      status: data.status,
    },
  });
};

// ➤ Update only status
export const updateSessionStatusService = async (sessionId, status) => {
  return await prisma.session.update({
    where: { id: Number(sessionId) },
    data: { status },
  });
};

// ➤ Delete session
export const deleteSessionService = async (sessionId) => {
  console.log("Deleting session with ID:", sessionId);
  return await prisma.session.delete({
    where: { id: Number(sessionId) },
  });
};
