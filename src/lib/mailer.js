// lib/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Existing: send OTP email
export async function sendStudentEmailOtp(email, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@example.com",
    to: email,
    subject: "Your Email Verification OTP",
    text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
  });
}

// NEW: send invite email with registration link
export async function sendStudentInviteEmail(email, inviteToken, consultantName) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteLink = `${baseUrl}/student/complete-registration?token=${inviteToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@example.com",
    to: email,
    subject: "You've Been Invited to Register",
    text: `Hello!\n\n${consultantName || "A consultant"} has invited you to register on our platform.\n\nClick here to complete your registration: ${inviteLink}\n\nThis link expires in 7 days.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2>You're Invited!</h2>
        <p><strong>${consultantName || "A consultant"}</strong> has invited you to register as a student on our platform.</p>
        <p>
          <a href="${inviteLink}" style="display: inline-block; background: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Complete Registration
          </a>
        </p>
        <p style="color: #64748b; font-size: 12px;">This link expires in 7 days.</p>
      </div>
    `,
  });
}
