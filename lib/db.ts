import clientPromise from "./mongodb";

export async function getDb() {
  const client = await clientPromise;
  return client.db("nayaghar");
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection("users");
}

export type UserRole = "buyer" | "agent" | "admin";

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
