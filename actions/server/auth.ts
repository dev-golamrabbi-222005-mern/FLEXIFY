"use server";

import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

interface UserPayload {
  email: string;
  phone?: string;
  imageUrl?: string;
  password: string;
  role?: string;
  name?: string;
}

interface DbUser {
  _id?: ObjectId;
  provider?: string;
  email: string;
  name?: string;
  phone?: string;
  imageUrl?: string;
  password?: string;
  role?: string;
}

export const postUser = async (payload: UserPayload) => {
  const { email, password, name, phone } = payload;

  if (!email || !password || !phone) {
    return { success: false };
  }

  const collection = dbConnect<DbUser>("users");

  const isExist = await collection.findOne({ email });
  if (isExist) {
    return { success: false };
  }

  const hashedPassword = await bcrypt.hash(password, 14);

  const newUser: DbUser = {
    ...payload,
    password: await bcrypt.hash(password, 14),
  };

  const result = await collection.insertOne(newUser);

  return {
    ...result,
    insertedId: result.insertedId.toString(),
  };
};

export const loginUser = async (payload: UserPayload) => {
  const { email, password } = payload;

  if (!email || !password) {
    return null;
  }

  const collection = dbConnect<DbUser>("users");

  const user = await collection.findOne({ email });
  if (!user || !user.password) {
    return null;
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    return null;
  }

  return {
    ...user,
    _id: user._id?.toString(),
  };
};