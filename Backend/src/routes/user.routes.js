import { Router } from "express";
import { registerController } from "../controllers/user.controller.js";
import { validateUserRegistration } from "../validators/user.validator.js";
const router = Router()

router.post("/register", validateUserRegistration, registerController)

export default router