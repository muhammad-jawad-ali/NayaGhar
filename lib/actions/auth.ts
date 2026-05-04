"use server";

import { getUsersCollection } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["buyer", "agent"]),
});

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  // Validation
  const result = signupSchema.safeParse({ name, email, password, role });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    const users = await getUsersCollection();
    
    // Check if user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await users.insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong during signup" };
  }
}
