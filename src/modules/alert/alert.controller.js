import { prisma } from "../../config/db.js";

export const getAlerts = async (req, res, next) => {
  try {
    const branchId = req.user.role === "Superadmin"
      ? undefined
      : req.user.branchId;

    const alerts = await prisma.alert.findMany({
      where: branchId ? { branchId } : {},
      orderBy: { id: "desc" },
      take: 50,
    });

    res.json({ success: true, alerts });
  } catch (err) {
    next(err);
  }
};
