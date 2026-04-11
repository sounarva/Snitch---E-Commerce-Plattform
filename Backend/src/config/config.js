import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGO_URL){
    throw new Error("Please provide MONGO_URL in the .env file 😭")
}

if(!process.env.JWT_SECRET){
    throw new Error("Please provide JWT_SECRET in the .env file 😭")
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("Please provide GOOGLE_CLIENT_ID in the .env file 😭")
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("Please provide GOOGLE_CLIENT_SECRET in the .env file 😭")
}


export const config = {
    MONGO_URL : process.env.MONGO_URL,
    JWT_SECRET : process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET
}