import { body, param, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400)
            .json({
                success: false,
                message: errors.array()[0].msg
            })
    }
    next()
}

export const validateCreateProduct = [
    body("title")
        .notEmpty().withMessage("Title is required"),

    body("description")
        .notEmpty().withMessage("Description is required"),

    body("priceAmt")
        .notEmpty().withMessage("Price amount is required"),

    body("priceCurrency")
        .notEmpty().withMessage("Price currency is required"),

    body("category")
        .notEmpty().withMessage("Category is required"),

    validate
]

export const validateSingleProduct = [
    param("id")
        .notEmpty().withMessage("Product ID is required")
        .isMongoId().withMessage("Invalid product ID"),

    validate
]

export const validateProductVariants = [
    param("productId")
        .notEmpty().withMessage("Product ID is required")
        .isMongoId().withMessage("Invalid product ID"),

    body("sizes")
        .notEmpty().withMessage("Sizes is required"),

    validate
]