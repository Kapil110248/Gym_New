import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const StaffAttendanceService = {
  async create(adminUserId, dto) {
    const admin = await prisma.user.findUnique({
      where: { id: adminUserId }
    });
    if (!admin) throw { status: 403, message: "Unauthorized" };

    const staff = await prisma.staff.findUnique({
      where: { id: dto.staffId }
    });
    if (!staff) throw { status: 400, message: "Staff not found" };

    if (!admin.branchId || admin.branchId !== staff.branchId) {
      throw { status: 403, message: "You cannot add attendance for staff of another branch" };
    }

    const date = new Date(dto.date);
    date.setHours(0, 0, 0, 0);

    const record = await prisma.staffAttendance.create({
      data: {
        staffId: dto.staffId,
        date,
        checkinTime: dto.checkinTime ? new Date(dto.checkinTime) : null,
        checkoutTime: dto.checkoutTime ? new Date(dto.checkoutTime) : null,
        mode: dto.mode || "Manual",
        shiftId: dto.shiftId || null,
        shiftName: dto.shiftName || null,
        status: dto.status,
        notes: dto.notes || null,
        createdById: adminUserId
      },
      include: {
        staff: true,
        createdBy: true
      }
    });

    return record;
  },

  async list(adminUserId, filters) {
    const admin = await prisma.user.findUnique({
      where: { id: adminUserId }
    });
    if (!admin) throw { status: 403, message: "Unauthorized" };

    const where = {};

    if (admin.branchId) {
      where.staff = { branchId: admin.branchId };
    }

    if (filters.staffId) where.staffId = Number(filters.staffId);
    if (filters.status) where.status = filters.status;

    if (filters.from || filters.to) {
      where.date = {};
      if (filters.from) where.date.gte = new Date(filters.from);
      if (filters.to) {
        const end = new Date(filters.to);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const list = await prisma.staffAttendance.findMany({
      where,
      include: { staff: true, createdBy: true },
      orderBy: { date: "desc" }
    });

    return list;
  },

  async getById(adminUserId, id) {
    const admin = await prisma.user.findUnique({
      where: { id: adminUserId }
    });

    const record = await prisma.staffAttendance.findUnique({
      where: { id },
      include: { staff: true, createdBy: true }
    });

    if (!record) throw { status: 404, message: "Attendance not found" };

    if (admin.branchId && record.staff.branchId !== admin.branchId) {
      throw { status: 403, message: "Forbidden" };
    }

    return record;
  },

  async update(adminUserId, id, dto) {
    const admin = await prisma.user.findUnique({
      where: { id: adminUserId }
    });

    const existing = await prisma.staffAttendance.findUnique({
      where: { id },
      include: { staff: true }
    });

    if (!existing) throw { status: 404, message: "Not found" };

    if (admin.branchId && existing.staff.branchId !== admin.branchId) {
      throw { status: 403, message: "Forbidden" };
    }

    const data = {};

    if (dto.staffId) data.staffId = dto.staffId;

    if (dto.date) {
      const d = new Date(dto.date);
      d.setHours(0, 0, 0, 0);
      data.date = d;
    }

    if ("checkinTime" in dto) {
      data.checkinTime = dto.checkinTime ? new Date(dto.checkinTime) : null;
    }

    if ("checkoutTime" in dto) {
      data.checkoutTime = dto.checkoutTime ? new Date(dto.checkoutTime) : null;
    }

    if (dto.mode !== undefined) data.mode = dto.mode;
    if (dto.shiftId !== undefined) data.shiftId = dto.shiftId;
    if (dto.shiftName !== undefined) data.shiftName = dto.shiftName;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.notes !== undefined) data.notes = dto.notes;

    const updated = await prisma.staffAttendance.update({
      where: { id },
      data,
      include: { staff: true, createdBy: true }
    });

    return updated;
  },

  async delete(adminUserId, id) {
    const admin = await prisma.user.findUnique({
      where: { id: adminUserId }
    });

    const record = await prisma.staffAttendance.findUnique({
      where: { id },
      include: { staff: true }
    });

    if (!record) throw { status: 404, message: "Not found" };

    if (admin.branchId && record.staff.branchId !== admin.branchId) {
      throw { status: 403, message: "Forbidden" };
    }

    await prisma.staffAttendance.delete({
      where: { id }
    });

    return { success: true };
  }
};

export default StaffAttendanceService;
