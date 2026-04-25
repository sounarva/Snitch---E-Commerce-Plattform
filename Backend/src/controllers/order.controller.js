import { razorpay } from "../services/payment.service.js";
import orderModel from "../models/order.model.js";
import crypto from "crypto";
import { config } from "../config/config.js";
import { getFormattedCart } from "../dao/cart.dao.js";
import cartModel from "../models/cart.model.js";

/**
 * @description Create order
 * @route POST /api/v1/order/create-order
 * @access Private
 */
export const createOrderController = async (req, res) => {
    try {
        const userId = req.user.id
        const { cart } = await getFormattedCart(userId);

        if (!cart || cart.length === 0) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Cart is empty"
                })
        }

        let totalAmount = 0

        cart.forEach(item => {
            if (item.price.currency === "USD") {
                totalAmount += item.price.amount * 83 * item.quantity
            } else {
                totalAmount += item.price.amount * item.quantity
            }
        })

        const options = {
            amount: Number((cart[0]?.totalPrice || totalAmount) * 100),
            currency: "INR",
            receipt: `order_${Date.now()}`
        }

        const order = await razorpay.orders.create(options)

        if (!order) {
            return res.status(500)
                .json({
                    success: false,
                    message: "Failed to create order"
                })
        }

        return res.status(200)
            .json({
                success: true,
                message: "Order created successfully",
                order
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal Server Error"
            })
    }
}

/**
 * @description Verify payment
 * @route POST /api/v1/order/verify-payment
 * @access Private
 */
export const verifyPaymentController = async (req, res) => {
    try {
        const userId = req.user.id
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        const sign = razorpay_order_id + "|" + razorpay_payment_id

        const expectedSign = crypto
            .createHmac("sha256", config.RAZORPAY_SECRET)
            .update(sign)
            .digest("hex")

        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment"
            })
        }

        const { cart } = await getFormattedCart(userId);

        if (!cart || cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        let totalAmount = 0;

        // 🔥 CREATE ORDER ITEMS (SNAPSHOT)
        const orderItems = cart.map(item => {
            let productPrice;

            if (item.price.currency === "USD") {
                totalAmount += item.price.amount * 83 * item.quantity;
                productPrice = item.price.amount * 83;
            } else {
                totalAmount += item.price.amount * item.quantity;
                productPrice = item.price.amount;
            }

            return {
                product: item.productId,
                variant: item.variantId || undefined,
                size: item.size || "",
                quantity: item.quantity,

                // 💎 snapshot
                title: item.title,
                price: productPrice,
                image: item.image || "",
                color: item.color || ""
            };
        });

        // 🔥 SAVE ORDER
        await orderModel.create({
            user: userId,
            items: orderItems,
            totalAmount: cart[0]?.totalPrice || totalAmount,
            paymentStatus: "paid",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        });

        // 🔥 CLEAR CART
        await cartModel.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } }
        );

        return res.status(200).json({
            success: true,
            message: "Payment successful & order placed"
        })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal Server Error"
            })
    }
}

/**
 * @description Get all orders
 * @route GET /api/v1/order/
 * @access Private
 */
export const getOrdersController = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderModel.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}