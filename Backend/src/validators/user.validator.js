import { body, validationResult } from "express-validator"

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

const validateUserRegistration = [
    body("fullname")
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("contactNumber")
        .trim()
        .notEmpty()
        .withMessage("Contact number is required")
        .isLength({ min: 10, max: 10 })
        .matches(/^[0-9]{10}$/)
        .withMessage("Contact number must be 10 digits long"),
    validate,
]

const validateUserLogin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required"),
    validate,
]

export {
    validateUserRegistration,
    validateUserLogin
}