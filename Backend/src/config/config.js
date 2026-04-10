import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGO_URL){
    throw new Error("Please provide MONGO_URL in the .env file 😭")
}


export const config = {
    MONGO_URL : process.env.MONGO_URL
}