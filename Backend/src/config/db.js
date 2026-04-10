import mongoose from "mongoose";
import { config } from "./config.js";

export const connectToDB = async() => {
    try {
        await mongoose.connect(config.MONGO_URL)
        console.log("Database connected successfully 😁");
    } catch (error) {
        console.log(error);
        throw new Error("Failed to connect to database 😭")
    }
}