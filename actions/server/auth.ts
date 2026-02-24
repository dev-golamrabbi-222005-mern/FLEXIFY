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
  const { email, password } = payload;

  const collection = dbConnect<DbUser>("users");

  const isExist = await collection.findOne({ email });
  if (isExist) {
    return {
      success: false,
      message: "Email already exists"
    };
  }

  const hashedPassword = await bcrypt.hash(password, 14);

  const newUser: DbUser = {
    ...payload,
    password: hashedPassword,
  };

  const result = await collection.insertOne(newUser);

  if(result.acknowledged){
    return{
      success: true,
      message: "Registration successful."
    }
  }
  else{
    return{
      success: false,
      message: "Something went wrong. Try again."
    }
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