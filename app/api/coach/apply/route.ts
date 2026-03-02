import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export interface Certification {
    title: string;
    issuedBy: string;
    year: number;
    certificateUrl?: string;
}

export interface Coach {
    _id?: ObjectId;
    fullName: string,
    email: string,
    phone: string,
    gender: "male" | "female" | "other",
    profileImage: string, // image URL
    bio: string, // short intro
    location: string, // country/city
    specialties: string, 
    // e.g. ["Weight Loss", "Muscle Gain", "HIIT", "Rehab"]
    experienceYears: number,
    certifications: Certification[],
    education?: string,
    trainingTypes: string[],
    // ["Online", "1-on-1", "Group", "Home Workout"]
    availableDays: string[],
    // ["Sunday", "Monday", "Wednesday"]
    preferredClients: string[],
    // ["Beginner", "Intermediate", "Advanced"]
    languages: string,
    pricing: {
        monthly?: number,
        perSession?: number
    },

    maxClients: number,
}

/* ===============================
   GET - Fetch All Coaches
================================= */

export async function GET(): Promise<Response> {
    try {
        const coaches = await dbConnect<Coach>("coaches")
        .find({})
        .toArray();

        return Response.json(coaches, { status: 200 });
    } catch (error) {
        return Response.json(
        { message: "Failed to fetch coaches" },
        { status: 500 }
        );
    }
}

/* ===============================
   POST - Create New Coach
================================= */

export async function POST(request: Request): Promise<Response> {
    try {
        const body: Coach = await request.json();

        // Basic required field validation
        if (!body.fullName || !body.email || !body.phone) {
            return Response.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const isExist = await dbConnect<Coach>("coaches").findOne({email: body.email});
        if(isExist){
            return Response.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        const result = await dbConnect<Coach>("coaches").insertOne(body);

        return Response.json(
            {
                acknowledged: result.acknowledged,
                insertedId: result.insertedId.toString(),
            },
            { status: 201 }
        );
    } catch (error) {
        return Response.json(
        { message: "Failed to create coach" },
        { status: 500 }
        );
    }
}