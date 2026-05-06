"use server";

import { getUsersCollection } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  const users = await getUsersCollection();
  
  const user = await users.findOne({ email });
  if (!user) {
    // Return success anyway for security to prevent email enumeration
    return { success: true, message: "If an account exists with this email, you will receive a reset link." };
  }

  const token = crypto.randomBytes(32).toString("hex");
  // Hash the token before storing it for better security
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const expires = new Date(Date.now() + 3600000); // 1 hour from now

  await users.updateOne(
    { email },
    { 
      $set: { 
        resetToken: hashedToken, 
        resetTokenExpires: expires 
      } 
    }
  );

  // In a real app, send email here. 
  // The link contains the RAW token, while the DB contains the HASHED token.
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;
  
  console.log(`Password reset link: ${resetUrl}`);
  
  // TODO: Implement actual email sending with Resend, SendGrid, etc.
  
  return { success: true, message: "If an account exists with this email, you will receive a reset link." };
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  
  if (!token || !password) {
    return { error: "Missing token or password" };
  }

  const users = await getUsersCollection();

  // Hash the incoming token to compare with the one in the database
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await users.findOne({
    resetToken: hashedToken,
    resetTokenExpires: { $gt: new Date() }
  });

  if (!user) {
    return { error: "Invalid or expired reset token" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await users.updateOne(
    { _id: user._id },
    { 
      $set: { 
        password: hashedPassword,
        updatedAt: new Date()
      },
      $unset: { resetToken: "", resetTokenExpires: "" }
    }
  );

  return { success: true };
}
