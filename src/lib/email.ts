import nodemailer from "nodemailer";

// Using Ethereal Email for testing. In production, provide actual SMTP credentials via environment variables.
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

let testAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  const isProduction = process.env.NODE_ENV === "production";
  
  if (isProduction && process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    if (!testAccount) {
      testAccount = await nodemailer.createTestAccount();
    }
    
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }

  return transporter;
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const tp = await getTransporter();
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const info = await tp.sendMail({
      from: '"VendorBridge Security" <security@vendorbridge.com>',
      to: email,
      subject: "Password Reset Request",
      text: `You have requested a password reset. Please click the following link to reset your password: ${resetLink}. This link will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You recently requested to reset your password for your VendorBridge account. Click the button below to reset it.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Your Password</a>
          </div>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p style="color: #666; font-size: 12px; margin-top: 40px;">This password reset link will expire in 15 minutes.</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    
    // In development mode, print the Ethereal URL to easily access the email
    if (process.env.NODE_ENV !== "production" || !process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    // Even if email fails, we shouldn't throw an error to the user to prevent enumeration,
    // but in a real app we might want to log this or alert the admins.
    return { success: false };
  }
}
