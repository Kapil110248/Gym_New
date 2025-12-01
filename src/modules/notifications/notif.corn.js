import cron from "node-cron";
import { prisma } from "../../config/db.js";
import { sendNotificationService } from "./notif.service.js";

cron.schedule("0 10 * * *", async () => {
  const soon = new Date();
  soon.setDate(soon.getDate() + 3);

  const members = await prisma.member.findMany({
    where: { membershipTo: { lte: soon } }
  });

  for (const m of members) {
    await sendNotificationService({
      type: "EMAIL",
      to: m.email,
      message: `Hi ${m.fullName}, your membership expires soon.`,
      memberId: m.id,
    });
  }
});
