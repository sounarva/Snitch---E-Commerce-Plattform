import { body, validationResult } from "express-validator"

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg
        })
    }
    next()
}


export const validateAddToCart = [
    body("productId")
        .notEmpty().withMessage("Product ID is required")
        .isMongoId().withMessage("Invalid product ID"),

    body("variantId")
        .notEmpty().withMessage("Variant ID is required")
        .isMongoId().withMessage("Invalid variant ID"),

    body("size")
        .notEmpty().withMessage("Size is required"),

    body("quantity")
        .notEmpty().withMessage("Quantity is required"),

    validate
]

export const validateUpdateCart = [
    body("cartItemId")
        .notEmpty().withMessage("Cart item ID is required")
        .isMongoId().withMessage("Invalid cart item ID"),

    body("quantity")
        .notEmpty().withMessage("Quantity is required"),

    validate
]

export const validateRemoveFromCart = [
    body("cartItemId")
        .notEmpty().withMessage("Cart item ID is required")
        .isMongoId().withMessage("Invalid cart item ID"),

    validate
]
