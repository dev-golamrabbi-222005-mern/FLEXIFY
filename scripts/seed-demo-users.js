/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: ".env.local" });

async function seedDemoUsers() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "flexify";
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const users = db.collection("users");

  const demoAccounts = [
    {
      email: "user@flexify.com",
      passwordRaw: "User@Flexify",
      name: "Demo Trainee",
      role: "user",
      status: "active",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      bio: "Fitness enthusiast exploring Flexify platform.",
    },
    {
      email: "coach@flexify.com",
      passwordRaw: "Coach@Flexify1",
      name: "Coach Jordan",
      role: "coach",
      status: "approved",
      specialties: ["Strength & Conditioning", "Hypertrophy"],
      experience: "8 years",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400",
      bio: "Certified CSCS strength coach specialized in powerbuilding.",
    },
    {
      email: "admin@flexify.com",
      passwordRaw: "Admin@Flexify",
      name: "System Admin",
      role: "admin",
      status: "active",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      bio: "Flexify Platform Administrator.",
    },
  ];

  for (const acc of demoAccounts) {
    const existing = await users.findOne({ email: acc.email });
    const hashedPassword = await bcrypt.hash(acc.passwordRaw, 10);
    if (!existing) {
      await users.insertOne({
        name: acc.name,
        email: acc.email,
        password: hashedPassword,
        role: acc.role,
        status: acc.status,
        image: acc.image,
        bio: acc.bio,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created demo user: ${acc.email} (${acc.role})`);
    } else {
      await users.updateOne(
        { email: acc.email },
        {
          $set: {
            password: hashedPassword,
            role: acc.role,
            status: acc.status,
            name: existing.name || acc.name,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`Updated demo user: ${acc.email} (${acc.role}) with valid password`);
    }
  }

  await client.close();
  console.log("Demo user seed completed.");
}

seedDemoUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
