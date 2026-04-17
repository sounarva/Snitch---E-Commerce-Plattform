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

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("Please provide IMAGEKIT_PRIVATE_KEY in the .env file 😭")
}

if(!process.env.REDIS_HOST){
    throw new Error("Please provide REDIS_HOST in the .env file 😭")
}

if(!process.env.REDIS_PORT){
    throw new Error("Please provide REDIS_PORT in the .env file 😭")
}

if(!process.env.REDIS_PASSWORD){
    throw new Error("Please provide REDIS_PASSWORD in the .env file 😭")
}


export const config = {
    MONGO_URL : process.env.MONGO_URL,
    JWT_SECRET : process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD
}