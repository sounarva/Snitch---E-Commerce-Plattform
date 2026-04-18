import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import upload from "../config/upload.js";
import { createProductController, getSellerProducts, getAllProducts, getSingleProduct, addProductVariantController } from "../controllers/product.controller.js"

const router = Router()

router.post("/create-product", authenticateSeller, upload.array("images", 5), createProductController)
router.get("/seller-products", authenticateSeller, getSellerProducts)
router.get("/all-products", getAllProducts)
router.get("/all-products/:id", getSingleProduct)
router.post("/add-variant/:productId", authenticateSeller, upload.array("images", 5), addProductVariantController)

export default router