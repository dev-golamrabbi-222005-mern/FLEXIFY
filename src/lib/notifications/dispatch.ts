import { pusherServer } from "@/lib/pusher";

export interface NotificationPayload {
  title?: string;
  message: string;
  type?: "payment" | "workout" | "coach" | "system" | "contact" | "review";
  link?: string;
  metadata?: Record<string, unknown>;
}

export function cleanChannelIdentifier(str: string): string {
  return str.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "-");
}

export async function sendNotificationToUser(
  userEmail: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    if (!userEmail) return false;
    const channel = `user-${cleanChannelIdentifier(userEmail)}`;
    await pusherServer.trigger(channel, "new-update", {
      ...payload,
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      timestamp: Date.now(),
    });
    return true;
  } catch (error) {
    console.error("[Notification Dispatch Error - User]:", error);
    return false;
  }
}

export async function sendNotificationToRole(
  role: "admin" | "coach" | "user",
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const channel = `role-${cleanChannelIdentifier(role)}`;
    await pusherServer.trigger(channel, "new-update", {
      ...payload,
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      timestamp: Date.now(),
    });
    return true;
  } catch (error) {
    console.error("[Notification Dispatch Error - Role]:", error);
    return false;
  }
}
