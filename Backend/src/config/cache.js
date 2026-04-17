import Redis from "ioredis"
import { config } from "./config.js"

const redisClient = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD
})

redisClient.on("connect", ()=>{
    console.log("Redis is running ⚡")
})

redisClient.on("error", (err)=>{
    console.log("Redis connection failed 😭", err)
})

export default redisClient