import { Router } from "express";
import { registerController, loginController } from "../controllers/user.controller.js";
import { validateUserRegistration, validateUserLogin } from "../validators/user.validator.js";
const router = Router()

router.post("/register", validateUserRegistration, registerController)
router.post("/login", validateUserLogin, loginController)

export default router