import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async(req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const result = await dbConnect("users").updateOne(
            {
                email: session?.user?.email
            },
            {
                $set: {
                    fullName: body.fullName,
                    name: body.fullName,
                    imageUrl: body.imageUrl,
                }
            }
        );
        return NextResponse.json(result, {status: 200});
    } catch (error) {
        return NextResponse.json(
            {message: "Failed to update coach profile"},
            {status: 500}
        );
    }
}