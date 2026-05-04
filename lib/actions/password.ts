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
  const expires = new Date(Date.now() + 3600000); // 1 hour from now

  await users.updateOne(
    { email },
    { 
      $set: { 
        resetToken: token, 
        resetTokenExpires: expires 
      } 
    }
  );

  // In a real app, send email here. For now, we'll just log it or return it for testing.
  console.log(`Password reset link: http://localhost:3000/auth/reset-password?token=${token}`);
  
  return { success: true, message: "If an account exists with this email, you will receive a reset link." };
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const users = await getUsersCollection();

  const user = await users.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() }
  });

  if (!user) {
    return { error: "Invalid or expired reset token" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await users.updateOne(
    { _id: user._id },
    { 
      $set: { password: hashedPassword },
      $unset: { resetToken: "", resetTokenExpires: "" }
    }
  );

  return { success: true };
}
