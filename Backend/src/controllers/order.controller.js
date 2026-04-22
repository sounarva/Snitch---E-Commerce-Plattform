import { razorpay } from "../services/payment.service.js";
import orderModel from "../models/order.model.js";
import cartModel from "../models/cart.model.js";
import crypto from "crypto";
import { config } from "../config/config.js";

/**
 * @description Create order
 * @route POST /api/v1/order/create-order
 * @access Private
 */
export const createOrderController = async (req, res) => {
    try {
        const userId = req.user.id
        const cart = await cartModel.findOne({
            user: userId
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Cart is empty"
                })
        }

        let totalAmount = 0

        cart.items.forEach(item => {
            if (item.product.price.currency === "USD") {
                totalAmount += item.product.price.amount * 83 * item.quantity
            } else {
                totalAmount += item.product.price.amount * item.quantity
            }
        })

        const options = {
            amount: totalAmount * 100,
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

        const cart = await cartModel
            .findOne({ user: userId })
            .populate("items.product");

        let totalAmount = 0;

        // 🔥 CREATE ORDER ITEMS (SNAPSHOT)
        const orderItems = cart.items.map(item => {
            const product = item.product;
            let productPrice;

            let variant = null;
            if (item.variant && product.variants && product.variants.length > 0) {
                variant = product.variants.find(
                    v => v._id.toString() === item.variant.toString()
                );
            }

            if (product.price.currency === "USD") {
                totalAmount += product.price.amount * 83 * item.quantity
                productPrice = product.price.amount * 83;
            } else {
                totalAmount += product.price.amount * item.quantity
                productPrice = product.price.amount;
            }

            return {
                product: product._id,
                variant: item.variant || undefined,
                size: item.size || "",
                quantity: item.quantity,

                // 💎 snapshot
                title: product.title,
                price: productPrice,
                image: variant?.images?.[0]?.url || product.images?.[0]?.url || "",
                color: variant?.color || ""
            };
        });

        // 🔥 SAVE ORDER
        await orderModel.create({
            user: userId,
            items: orderItems,
            totalAmount,
            paymentStatus: "paid",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        })

        // 🔥 CLEAR CART
        cart.items = []
        await cart.save()

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