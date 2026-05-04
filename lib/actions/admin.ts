"use server";

import { getUsersCollection } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function getAllUsers() {
  await ensureAdmin();
  const users = await getUsersCollection();
  const allUsers = await users.find({}, { projection: { password: 0 } }).toArray();
  return JSON.parse(JSON.stringify(allUsers));
}

export async function deleteUser(userId: string) {
  await ensureAdmin();
  const users = await getUsersCollection();
  await users.deleteOne({ _id: new ObjectId(userId) });
  return { success: true };
}

export async function updateUserRole(userId: string, role: string) {
  await ensureAdmin();
  const users = await getUsersCollection();
  await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role, updatedAt: new Date() } }
  );
  return { success: true };
}
