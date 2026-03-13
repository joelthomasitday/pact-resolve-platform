import nodemailer from "nodemailer";

/**
 * Mail Utility for sending emails via SMTP.
 * Configuration is pulled from environment variables.
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
  attachments?: any[];
}

export async function sendMail(options: SendMailOptions) {
  try {
    // Check if configuration exists
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("Mail configuration missing (SMTP_USER/SMTP_PASS). Email will NOT be sent.");
      console.log("Mocking email send to:", options.to);
      return { success: false, error: "Mail configuration missing" };
    }

    const info = await transporter.sendMail({
      from: `"PACT Platform" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      ...options,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
