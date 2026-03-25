import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    session: {
      coachName: "Coach John",
      coachImage: "https://i.ibb.co.com/Pv0wP422/user.png",
      meetLink: "https://meet.google.com/pwh-fetr-kfx",
      time: "Today • 10:00 AM - 11:00 AM",
    },
    messages: [
      { sender: "coach", message: "Hey! Ready for today’s workout? 💪" },
      { sender: "user", message: "Yes coach! Let’s go 🔥" },
      { sender: "coach", message: "Start with warm-up first." },
    ],
  });
}