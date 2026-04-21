import { Router } from "express";
import { addToCartController, fetchCartController, removeFromCartController, updateCartController } from "../controllers/cart.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart, validateUpdateCart, validateRemoveFromCart } from "../validators/cart.validator.js"

const router = Router()

router.post("/add-to-cart", authenticateUser, validateAddToCart, addToCartController)
router.get("/fetch-cart", authenticateUser, fetchCartController)
router.put("/update-cart", authenticateUser, validateUpdateCart, updateCartController)
router.delete("/remove-from-cart", authenticateUser, validateRemoveFromCart, removeFromCartController)

export default router