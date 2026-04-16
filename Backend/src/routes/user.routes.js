import { Router } from "express";
import { registerController, loginController, googleCallbackController, getmeController } from "../controllers/user.controller.js";
import { validateUserRegistration, validateUserLogin } from "../validators/user.validator.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middleware.js";
const router = Router()

router.post("/register", validateUserRegistration, registerController)
router.post("/login", validateUserLogin, loginController)
router.get("/me", authenticateUser, getmeController)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallbackController);

export default router