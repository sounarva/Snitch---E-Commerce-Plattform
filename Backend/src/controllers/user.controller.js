import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import redisClient from "../config/cache.js"

/**
 * @description Send token to user
 * @param {Object} user - User object
 * @param {number} statusCode - Status code
 * @param {Object} res - Response object
 * @param {string} message - Message
 */
const sendToken = async (user, statusCode, res, message) => {
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        })
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(statusCode)
        .json({
            success: true,
            message,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                contactNumber: user.contactNumber,
                role: user.role
            }
        })
}

/**
 * @description Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const registerController = async (req, res) => {
    try {
        const { fullname, email, password, contactNumber, isSeller } = req.body

        const userExists = await userModel.findOne({
            $or: [
                { email },
                { contactNumber }
            ]
        })
        if (userExists) {
            return res.status(400)
                .json({
                    success: false,
                    message: "User already exists"
                })
        }

        const user = await userModel.create({
            fullname,
            email,
            password,
            contactNumber,
            role: isSeller ? "seller" : "buyer"
        })

        await sendToken(user, 201, res, "User registered successfully ✅")
    } catch (error) {
        console.error("Register error:", error)
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

/**
 * @description Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({
            email
        })

        if (!user) {
            return res.status(404)
                .json({
                    success: false,
                    message: "User not found"
                })
        }

        const isPasswordValid = await user.comparePassword(password)

        if (!isPasswordValid) {
            return res.status(401)
                .json({
                    success: false,
                    message: "Invalid password"
                })
        }

        await sendToken(user, 200, res, "User logged in successfully ✅")
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

/**
 * @description Get current user
 * @route GET /api/v1/auth/me
 * @access Private
 */
const getmeController = async (req, res) => {
    try {
        const user = req.user
        return res.status(200)
            .json({
                success: true,
                message: "User fetched successfully ✅",
                user
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

/**
 * @description Logout user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Token not found"
                })
        }

        await redisClient.set(token, Date.now(), "EX", 7 * 24 * 60 * 60)
        res.clearCookie("token")
        return res.status(200)
            .json({
                success: true,
                message: "User logged out successfully ✅"
            })
    } catch (err) {
        return res.status(500)
            .json({
                success: false,
                message: err.message || "Internal server error"
            })
    }
}

/**
 * @description Google callback
 * @route GET /api/v1/auth/google/callback
 * @access Public
 */
const googleCallbackController = async (req, res) => {
    try {
        const profile = req.user
        if (!profile || !profile.emails || !profile.emails[0].value) {
            return res.redirect(`${config.BASE_URL}/login`);
        }

        const email = profile.emails[0].value;
        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                fullname: profile.displayName,
                email,
                password: "",
                contactNumber: profile.phone || "",
                role: "buyer"
            })
        }

        const token = jwt.sign({
            id: user._id
        }, config.JWT_SECRET,
            {
                expiresIn: "7d"
            })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.redirect(`${config.BASE_URL}`);

    } catch (error) {
        console.error("Google callback error:", error)
        res.redirect(`${config.BASE_URL}/login`);
    }
}

export {
    registerController,
    loginController,
    googleCallbackController,
    getmeController,
    logoutController
}
