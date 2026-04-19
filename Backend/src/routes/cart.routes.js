import { Router } from "express";
import { addToCartController, fetchCartController, removeFromCartController, updateCartController } from "../controllers/cart.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/add-to-cart", authenticateUser, addToCartController)
router.get("/fetch-cart", authenticateUser, fetchCartController)
router.put("/update-cart", authenticateUser, updateCartController)
router.delete("/remove-from-cart", authenticateUser, removeFromCartController)

export default router