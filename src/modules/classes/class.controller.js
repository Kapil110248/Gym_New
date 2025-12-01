import {
  createClassTypeService,
  listClassTypesService,
  createScheduleService,
  listSchedulesService,
  bookClassService,
  cancelBookingService,
  memberBookingsService
} from "./class.service.js";

export const createClassType = async (req, res, next) => {
  try {
    const r = await createClassTypeService(req.body.name);
    res.json({ success: true, classType: r });
  } catch (err) {
    next(err);
  }
};

export const listClassTypes = async (req, res, next) => {
  try {
    const r = await listClassTypesService();
    res.json({ success: true, classTypes: r });
  } catch (err) {
    next(err);
  }
};

export const createSchedule = async (req, res, next) => {
  try {
    const r = await createScheduleService(req.body);
    res.json({ success: true, schedule: r });
  } catch (err) {
    next(err);
  }
};

export const listSchedules = async (req, res, next) => {
  try {
    const branchId = parseInt(req.params.branchId);
    const r = await listSchedulesService(branchId);
    res.json({ success: true, schedules: r });
  } catch (err) {
    next(err);
  }
};

export const bookClass = async (req, res, next) => {
  try {
    const { memberId, scheduleId } = req.body;
    const r = await bookClassService(memberId, scheduleId);
    res.json({ success: true, booking: r });
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { memberId, scheduleId } = req.body;
    const r = await cancelBookingService(memberId, scheduleId);
    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    next(err);
  }
};

export const memberBookings = async (req, res, next) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const r = await memberBookingsService(memberId);
    res.json({ success: true, bookings: r });
  } catch (err) {
    next(err);
  }
};
