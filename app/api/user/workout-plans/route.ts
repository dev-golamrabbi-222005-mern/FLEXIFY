import { dbConnect } from "@/lib/dbConnect";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { planName, exercises, userEmail } = body; 

        if (!planName || !exercises || exercises.length === 0) {
            return Response.json({ message: "Invalid Plan Data" }, { status: 400 });
        }

        const collection = await dbConnect("user_plans"); 
        const result = await collection.insertOne({
            planName,
            exercises,
            userEmail,
            createdAt: new Date()
        });

        return Response.json({ message: "Plan saved!", id: result.insertedId }, { status: 201 });
    } catch (error) {
        return Response.json({ message: "Error saving plan" }, { status: 500 });
    }
}