import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

const sendToken = async (user, statusCode, res, message) => {
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        })
    res.cookie("token", token)

    res.status(statusCode)
        .json({
            success: true,
            message,
            token,
            user
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
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error"
            })
    }
}


export {
    registerController
}
