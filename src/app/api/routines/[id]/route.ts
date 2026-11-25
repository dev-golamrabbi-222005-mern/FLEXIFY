import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId, Document } from "mongodb";
import { Exercise, SetData } from "@/components/user/workout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
interface RoutineDocument extends Document {
  _id: ObjectId;
  planName: string;
  exercises: Exercise[];
}

interface LoggedExercise {
  exerciseId: string;
  sets: SetData[];
}

interface WorkoutLogDocument extends Document {
  _id: ObjectId;
  routineId: string;
  exercises: LoggedExercise[];
  createdAt: Date;
}

interface FetchedRoutine {
  planName: string;
  exercises: Exercise[];
}
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const email = session.user.email;
    const { id } = await params;
    const routineCol = await dbConnect("user_routines");
    const exerciseCol = await dbConnect("exercises");
    const logCol = await dbConnect("workout_logs");

    let fetchedRoutine: FetchedRoutine | null = null;
    const suggestedPlans: Record<string, string[]> = {
      beginner: ["Pushups", "One-Arm Dumbbell Row", "Dumbbell Shoulder Press", "Bodyweight Squat", "Dumbbell Deadlift", "3/4 Sit-Up"],
      intermediate: ["Barbell Squat", "Barbell Bench Press - Medium Grip", "One-Arm Dumbbell Row", "Dumbbell Shoulder Press", "Zottman Curl", "Dumbbell Triceps Extension", "Knee/Hip Raise On Parallel Bars"],
      advanced: ["Dumbbell Bench Press", "Weighted Pull Ups", "Bent Over Barbell Row", "Clean and Press", "Barbell Squat", "Barbell Deadlift", "Zottman Preacher Curl", "Dumbbell Triceps Extension", "Ab Roller"]
    };
if (suggestedPlans[id]) {
      const names = suggestedPlans[id];
      const exercises = await exerciseCol.find<Exercise>({ name: { $in: names } }).toArray();
      fetchedRoutine = { 
        planName: id.toUpperCase() + " PLAN", 
        exercises: exercises 
      };
    } 
    else if (ObjectId.isValid(id)) {
      const dbResult = await routineCol.findOne<RoutineDocument>({ _id: new ObjectId(id) });
      if (dbResult) {
        fetchedRoutine = {
          planName: dbResult.planName,
          exercises: dbResult.exercises
        };
      }
    }

    if (!fetchedRoutine) {
      return NextResponse.json({ success: false, message: "Routine Not Found in DB" }, { status: 404 });
    }

    const lastWorkout = await logCol
      .find<WorkoutLogDocument>({ routineId: id, email:email })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    const previousLog: WorkoutLogDocument | null = lastWorkout[0] || null;

    const formattedExercises: Exercise[] = fetchedRoutine.exercises.map((ex: Exercise): Exercise => {
      
      const prevEx: LoggedExercise | undefined = previousLog?.exercises?.find(
        (pe: LoggedExercise) => pe.exerciseId === (ex._id || ex.id)?.toString()
      );

      return {
        ...ex,
        sets: (ex.sets && ex.sets.length > 0 ? ex.sets : [
          { id: crypto.randomUUID(), weight: "", reps: "", seconds: "", previous: "-", isCompleted: false }
        ]).map((set: SetData, idx: number): SetData => {
          
          const prevSet: SetData | undefined = prevEx?.sets[idx]; 
          let historyStr = "-";

          if (prevSet) {
            if (ex.trackingType === "WEIGHT_REPS") {
              historyStr = `${prevSet.weight}kg x ${prevSet.reps}`;
            } else if (ex.trackingType === "REPS") {
              historyStr = `${prevSet.reps} reps`;
            } else if (ex.trackingType === "TIME") {
              historyStr = prevSet.seconds || "-";
            }
          }

          return {
            ...set,
            previous: historyStr, 
            isCompleted: false    
          };
        })
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: { planName: fetchedRoutine.planName, exercises: formattedExercises } 
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Fetch Error:", errorMsg);
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}