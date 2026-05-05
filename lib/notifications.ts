import { getDb } from "./db";
import { ObjectId } from "mongodb";
import type { Notification, NotificationType } from "./types";

export async function createNotification(data: Omit<Notification, "_id" | "isRead" | "createdAt">) {
  try {
    const db = await getDb();
    const collection = db.collection("notifications");
    
    const notification: Notification = {
      ...data,
      isRead: false,
      createdAt: new Date(),
    };
    
    await collection.insertOne(notification as any);
    
    // In a real app, you would trigger a WebSocket event here
    console.log(`Notification created for user ${data.userId}: ${data.title}`);
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function getNotifications(userId: string) {
  try {
    const db = await getDb();
    const collection = db.collection("notifications");
    return await collection.find({ userId }).sort({ createdAt: -1 }).limit(10).toArray();
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return [];
  }
}

export async function markAsRead(notificationId: string, userId: string) {
  try {
    const db = await getDb();
    const collection = db.collection("notifications");
    await collection.updateOne(
      { 
        _id: new ObjectId(notificationId) as any,
        userId: userId 
      },
      { $set: { isRead: true } }
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}
export async function markAllAsRead(userId: string) {
  try {
    const db = await getDb();
    const collection = db.collection("notifications");
    await collection.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
}
