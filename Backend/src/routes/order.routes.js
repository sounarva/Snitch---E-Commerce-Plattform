import { Router } from "express"
import { createOrderController, verifyPaymentController, getOrdersController } from "../controllers/order.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/create-order", authenticateUser, createOrderController)
router.post("/verify-payment", authenticateUser, verifyPaymentController)
router.get("/", authenticateUser, getOrdersController)

export default router