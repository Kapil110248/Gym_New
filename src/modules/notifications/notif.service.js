import { prisma } from "../../config/db.js";
import nodemailer from "nodemailer";  // email only — other providers optional

export const sendNotificationService = async ({ type, to, message, memberId }) => {
  // Log first
  const log = await prisma.notificationLog.create({
    data: { type, to, message, memberId }
  });

  // EMAIL sending (SMTP example)
  if (type === "EMAIL") {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: "Gym Notification",
      text: message,
    });

    await prisma.notificationLog.update({
      where: { id: log.id },
      data: { status: "SENT" }
    });
  }

  // WHATSAPP / SMS provider hooks — add later
  // if(type === "WHATSAPP") { ... }
  // if(type === "SMS") { ... }

  return log;
};
