import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.MONGODB_URI!);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    throw new Error("MongoDB Connection Failed");
  }
}
