import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import upload from "../config/upload.js";
import { createProductController, getSellerProducts, getAllProducts, getSingleProduct, addProductVariantController, searchProductsController } from "../controllers/product.controller.js"
import { validateCreateProduct, validateSingleProduct, validateProductVariants } from "../validators/product.validator.js"

const router = Router()

router.post("/create-product", authenticateSeller, upload.array("images", 6), validateCreateProduct, createProductController)
router.get("/seller-products", authenticateSeller, getSellerProducts)
router.get("/all-products", getAllProducts)
router.get("/all-products/:id", validateSingleProduct, getSingleProduct)
router.post("/add-variant/:productId", authenticateSeller, upload.array("images", 6), validateProductVariants, addProductVariantController)
router.get("/search-products", searchProductsController)

export default router