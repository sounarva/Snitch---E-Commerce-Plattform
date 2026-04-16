import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import { config } from "../config/config.js"

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Token not found"
                })
        }

        const decoedToken = jwt.verify(token, config.JWT_SECRET)
        const user = await userModel.findById(decoedToken.id)
        if (!user) {
            return res.status(404)
                .json({
                    success: false,
                    message: "User not found"
                })
        }

        req.user = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            contactNumber: user.contactNumber,
            role: user.role
        }
        next()
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

const authenticateSeller = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Token not found"
                })
        }

        const decoedToken = jwt.verify(token, config.JWT_SECRET)
        const user = await userModel.findById(decoedToken.id)
        if (!user) {
            return res.status(404)
                .json({
                    success: false,
                    message: "User not found"
                })
        }

        if (user.role !== "seller") {
            return res.status(403)
                .json({
                    success: false,
                    message: "Unauthorized"
                })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error"
            })
    }
}

export { authenticateUser, authenticateSeller }