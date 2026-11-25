/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const TARGET_EMAILS = [
  "g.rabbi2005.555@gmail.com",
  "g.rabbi200518@gmail.com",
  "user@flexify.com"
];

async function seedUserData() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "FlexifiersDB";
  if (!uri) throw new Error("MONGODB_URI missing");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const usersCol = db.collection("users");
  const routinesCol = db.collection("user_routines");
  const workoutLogsCol = db.collection("workout_logs");
  const dailyLogsCol = db.collection("daily-logs");
  const dailyGoalsCol = db.collection("daily_goals");
  const exercisesCol = db.collection("exercises");

  // Fetch some real exercises from db for routines
  const sampleExercises = await exercisesCol.find({}).limit(10).toArray();
  const ex1 = sampleExercises[0] || { _id: new ObjectId(), name: "Barbell Bench Press" };
  const ex2 = sampleExercises[1] || { _id: new ObjectId(), name: "Incline Dumbbell Press" };
  const ex3 = sampleExercises[2] || { _id: new ObjectId(), name: "Dumbbell Flyes" };
  const ex4 = sampleExercises[3] || { _id: new ObjectId(), name: "Barbell Squat" };
  const ex5 = sampleExercises[4] || { _id: new ObjectId(), name: "Leg Press" };

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  for (const email of TARGET_EMAILS) {
    console.log(`\n--- Seeding User Data for: ${email} ---`);

    // 1. Ensure user has a rich fitnessProfile
    const user = await usersCol.findOne({ email });
    const fitnessProfile = {
      age: 24,
      gender: "Male",
      height: 180,
      weight: 76,
      goal: "Muscle Gain",
      activityLevel: "Moderately Active",
      workoutDays: "4 Days",
      sleepHours: 8,
      waterIntake: 3,
      injuries: "None",
      medicalCondition: "None",
      dietType: "High Protein"
    };

    if (user) {
      await usersCol.updateOne(
        { email },
        { 
          $set: { 
            fitnessProfile: user.fitnessProfile && Object.keys(user.fitnessProfile).length > 2 
              ? { ...fitnessProfile, ...user.fitnessProfile } 
              : fitnessProfile,
            updatedAt: new Date()
          } 
        }
      );
      console.log(`✓ Updated fitnessProfile for ${email}`);
    } else {
      await usersCol.insertOne({
        name: email.split("@")[0],
        email,
        role: "user",
        status: "active",
        fitnessProfile,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✓ Created new user document with fitnessProfile for ${email}`);
    }

    // 2. Ensure user has routines in user_routines
    const routineCount = await routinesCol.countDocuments({ userEmail: email });
    if (routineCount === 0) {
      const routines = [
        {
          userEmail: email,
          planName: "CHEST & TRICEPS HYPERTROPHY",
          createdAt: new Date(),
          exercises: [
            { id: ex1._id.toString(), name: ex1.name, sets: 4, reps: 10 },
            { id: ex2._id.toString(), name: ex2.name, sets: 3, reps: 12 },
            { id: ex3._id.toString(), name: ex3.name, sets: 3, reps: 15 },
          ]
        },
        {
          userEmail: email,
          planName: "LEG POWER & GLUTES",
          createdAt: new Date(Date.now() - 86400000),
          exercises: [
            { id: ex4._id.toString(), name: ex4.name, sets: 4, reps: 8 },
            { id: ex5._id.toString(), name: ex5.name, sets: 3, reps: 10 },
          ]
        },
        {
          userEmail: email,
          planName: "FULL BODY METABOLIC BURN",
          createdAt: new Date(Date.now() - 172800000),
          exercises: [
            { id: ex1._id.toString(), name: ex1.name, sets: 3, reps: 12 },
            { id: ex4._id.toString(), name: ex4.name, sets: 3, reps: 12 },
          ]
        }
      ];
      await routinesCol.insertMany(routines);
      console.log(`✓ Seeded 3 custom user routines for ${email}`);
    } else {
      console.log(`✓ User already has ${routineCount} routines`);
    }

    // 3. Ensure user has recent workout_logs (for today, yesterday, and past week)
    const logsCount = await workoutLogsCol.countDocuments({ email });
    if (logsCount < 3) {
      // Create entries for the last 5 days
      const daysAgo = [0, 1, 3, 4, 6];
      const logsToInsert = daysAgo.map((d, idx) => {
        const logDate = new Date();
        logDate.setDate(logDate.getDate() - d);
        return {
          email,
          userId: user?._id?.toString() || new ObjectId().toString(),
          planName: idx % 2 === 0 ? "CHEST & TRICEPS HYPERTROPHY" : "LEG POWER & GLUTES",
          duration: 2700 + idx * 300, // 45-65 mins
          exercises: [
            {
              exerciseId: ex1._id.toString(),
              name: ex1.name,
              trackingType: "WEIGHT_REPS",
              sets: [
                { id: `s1-${idx}`, weight: "60", reps: "10", isCompleted: true },
                { id: `s2-${idx}`, weight: "65", reps: "8", isCompleted: true },
                { id: `s3-${idx}`, weight: "70", reps: "6", isCompleted: true }
              ]
            },
            {
              exerciseId: ex2._id.toString(),
              name: ex2.name,
              trackingType: "WEIGHT_REPS",
              sets: [
                { id: `s4-${idx}`, weight: "24", reps: "12", isCompleted: true },
                { id: `s5-${idx}`, weight: "26", reps: "10", isCompleted: true }
              ]
            }
          ],
          createdAt: logDate
        };
      });
      await workoutLogsCol.insertMany(logsToInsert);
      console.log(`✓ Seeded 5 workout logs across past week for ${email}`);
    } else {
      console.log(`✓ User already has ${logsCount} workout logs`);
    }

    // 4. Ensure user has daily log with meals and water
    const dailyLogId = `${email}_${todayStr}`;
    const existingDaily = await dailyLogsCol.findOne({ _id: dailyLogId });
    if (!existingDaily) {
      await dailyLogsCol.insertOne({
        _id: dailyLogId,
        date: todayStr,
        userEmail: email,
        waterIntake: 6,
        totalCalories: 1850,
        lastUpdated: new Date().toISOString(),
        meals: {
          breakfast: {
            entries: [
              {
                id: `b-${Date.now()}-1`,
                foodItem: {
                  _id: new ObjectId().toString(),
                  name: "Oatmeal with Blueberries",
                  calories: 350,
                  protein: 12,
                  carbs: 58,
                  fats: 6
                },
                quantity: 1
              },
              {
                id: `b-${Date.now()}-2`,
                foodItem: {
                  _id: new ObjectId().toString(),
                  name: "Boiled Eggs (2)",
                  calories: 140,
                  protein: 12,
                  carbs: 1,
                  fats: 10
                },
                quantity: 1
              }
            ]
          },
          lunch: {
            entries: [
              {
                id: `l-${Date.now()}-1`,
                foodItem: {
                  _id: new ObjectId().toString(),
                  name: "Grilled Chicken Breast with Brown Rice",
                  calories: 650,
                  protein: 48,
                  carbs: 65,
                  fats: 12
                },
                quantity: 1
              }
            ]
          },
          dinner: {
            entries: [
              {
                id: `d-${Date.now()}-1`,
                foodItem: {
                  _id: new ObjectId().toString(),
                  name: "Salmon Fillet with Steamed Veggies",
                  calories: 550,
                  protein: 40,
                  carbs: 15,
                  fats: 22
                },
                quantity: 1
              }
            ]
          }
        }
      });
      console.log(`✓ Seeded today daily-log (meals + water) for ${email}`);
    } else {
      console.log(`✓ User already has daily-log for today`);
    }

    // 5. Ensure today's goal is set
    const todayGoal = await dailyGoalsCol.findOne({
      $or: [{ email }, { userEmail: email }],
      date: todayStr
    });
    if (!todayGoal) {
      await dailyGoalsCol.insertOne({
        email,
        userEmail: email,
        planName: "CHEST & TRICEPS HYPERTROPHY",
        totalExercises: 3,
        progress: 67,
        date: todayStr,
        createdAt: new Date()
      });
      console.log(`✓ Seeded today goal for ${email}`);
    } else {
      console.log(`✓ User already has today goal`);
    }
  }

  await client.close();
  console.log("\n=== All user data seeded successfully! ===");
}

seedUserData().catch((err) => {
  console.error(err);
  process.exit(1);
});
