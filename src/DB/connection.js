import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connection established successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
}