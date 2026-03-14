import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const logCol = await dbConnect("workout_logs");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const logs = await logCol.find({ createdAt: { $gte: startDate } }).toArray();

    const result = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      
      const dayLogs = logs.filter(log => new Date(log.createdAt).toDateString() === d.toDateString());
      
      const totalMinutes = dayLogs.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0) / 60;
      
      result.push({
        day: dayName,
        workout: Math.round(totalMinutes),
        calories: Math.round(totalMinutes * 6) 
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] });
  }
}