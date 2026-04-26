import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import path from "path";
import userRoutes from "./routes/user.routes.js"
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import orderRoutes from "./routes/order.routes.js"
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from "./config/config.js"

const app = express()
const publicPath = path.resolve(process.cwd(), "public");
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

app.use(passport.initialize());
app.use(express.static(publicPath));

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.BASE_URL
        ? `${config.BASE_URL}/api/v1/auth/google/callback`
        : "/api/v1/auth/google/callback",
    proxy: true
}, (_, __, profile, done) => {
    return done(null, profile);
}))

app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/cart", cartRoutes)
app.use("/api/v1/order", orderRoutes)

//serving frontend
app.get("*name", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
        return next();
    }
    res.sendFile(path.join(publicPath, "index.html"));
});

export default app