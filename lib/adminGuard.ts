import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export interface AdminAuthResult {
  authorized: boolean;
  response?: NextResponse;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session?: any;
}

/**
 * Enforces admin authorization for API route handlers.
 * Returns { authorized: false, response } if user is not authenticated or not an admin.
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "admin") {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, session };
}
