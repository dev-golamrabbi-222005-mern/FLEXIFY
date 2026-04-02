import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt";

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return NextResponse.json(
            {message: "Unauthorized"},
            {status: 401}
        );
    }
    const {currentPassword, newPassword} = await req.json();
    const user = await dbConnect("users").findOne({
        email: session?.user?.email,
    });
    if (!user || !user.password) {
        return NextResponse.json(
            {message: "User not found or password not set"},
            {status: 404}
        );
    }
    const isMatched = await bcrypt.compare(currentPassword, user.password);
    if(!isMatched) return NextResponse.json(
        {message: "Incorrect Password"},
        {status: 400}
    );
    const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 14) : undefined;

    const result = await dbConnect("users").updateOne({
        email: session?.user?.email,
    }, {
        $set: {
            password: hashedPassword
        }
    });
    return NextResponse.json(result);

} 