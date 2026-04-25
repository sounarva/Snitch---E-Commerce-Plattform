import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { getFormattedCart } from "../dao/cart.dao.js";

/**
 * @description Add to cart
 * @route POST /api/v1/cart/add-to-cart
 * @access Private
 */
export const addToCartController = async (req, res) => {
    try {
        const userID = req.user.id || req.user._id
        const { productId, variantId, size, quantity } = req.body

        let product = await productModel.findById(productId)
        if (!product) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Product not found"
                })
        }

        const variant = product.variants?.find(v => v._id.toString() === (variantId ? variantId.toString() : null))
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" })
        }

        const sizeObj = variant.sizes?.find(s => s.size === size)
        if (!sizeObj) {
            return res.status(404).json({ success: false, message: "Size not found" })
        }

        if (quantity > sizeObj.stock) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Not enough stock"
                })
        }

        let cart = await cartModel.findOne({ user: userID })

        if (!cart) {
            cart = await cartModel.create({
                user: userID,
                items: [{
                    product: productId,
                    variant: variantId,
                    size,
                    quantity
                }]
            })
            sizeObj.stock -= quantity
            await product.save()

            const cartData = await getFormattedCart(userID)
            return res.status(201)
                .json({
                    success: true,
                    message: "Item added to cart successfully",
                    ...cartData
                })
        }

        const existingItem = cart.items.find(item => {
            const isSameProduct = item.product.toString() === productId;
            const itemVariantStr = item.variant ? item.variant.toString() : null;
            const reqVariantStr = variantId ? variantId.toString() : null;
            const isSameVariant = itemVariantStr === reqVariantStr;
            const isSameSize = (item.size || null) === (size || null);
            return isSameProduct && isSameVariant && isSameSize;
        });

        if (existingItem) {
            sizeObj.stock -= quantity
            await product.save()
            existingItem.quantity += quantity
        } else {
            sizeObj.stock -= quantity
            await product.save()
            cart.items.push({
                product: productId,
                variant: variantId,
                size,
                quantity
            })
        }

        await cart.save()
        const cartData = await getFormattedCart(userID)

        return res.status(200)
            .json({
                success: true,
                message: "Item added to cart successfully",
                ...cartData
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
 * @description Fetch cart items
 * @route GET /api/v1/cart/fetch-cart
 * @access Private
 */
export const fetchCartController = async (req, res) => {
    try {
        const userID = req.user.id || req.user._id
        const cartData = await getFormattedCart(userID)

        return res.status(200)
            .json({
                success: true,
                message: "Cart fetched successfully",
                ...cartData
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
 * @description Update quantity of an item in cart
 * @route PUT /api/v1/cart/update-cart
 * @access Private
 */
export const updateCartController = async (req, res) => {
    try {
        const userID = req.user.id || req.user._id
        const { cartItemId, quantity } = req.body

        let cart = await cartModel.findOne({ user: userID })

        if (!cart) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Cart not found"
                })
        }

        const existingItem = cart.items.id(cartItemId)

        if (!existingItem) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Item not found in cart"
                })
        }

        let product = await productModel.findById(existingItem.product)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        const variant = product.variants?.find(v => v._id.toString() === (existingItem.variant ? existingItem.variant.toString() : null))
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" })
        }

        const sizeObj = variant.sizes?.find(s => s.size === existingItem.size)
        if (!sizeObj) {
            return res.status(404).json({ success: false, message: "Size not found" })
        }

        const delta = quantity - existingItem.quantity

        if (delta > 0 && delta > sizeObj.stock) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Not enough stock"
                })
        }

        if (quantity <= 0) {
            sizeObj.stock += existingItem.quantity
            cart.items.pull(cartItemId)
        } else {
            sizeObj.stock -= delta
            existingItem.quantity = quantity
        }

        await product.save()
        await cart.save()
        const cartData = await getFormattedCart(userID)

        return res.status(200)
            .json({
                success: true,
                message: "Cart updated successfully",
                ...cartData
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
 * @description Remove item from cart
 * @route DELETE /api/v1/cart/remove-from-cart
 * @access Private
 */
export const removeFromCartController = async (req, res) => {
    try {
        const userID = req.user.id || req.user._id
        const { cartItemId } = req.body

        let cart = await cartModel.findOne({ user: userID })
        if (!cart) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Cart not found"
                })
        }

        const existingItem = cart.items.id(cartItemId)
        if (!existingItem) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Item not found in cart"
                })
        }

        let product = await productModel.findById(existingItem.product)
        if (product) {
            const variant = product.variants?.find(v => v._id.toString() === (existingItem.variant ? existingItem.variant.toString() : null))
            const sizeObj = variant?.sizes?.find(s => s.size === existingItem.size)
            if (sizeObj) {
                sizeObj.stock += existingItem.quantity
                await product.save()
            }
        }

        cart.items = cart.items.filter(item => item._id.toString() !== cartItemId)
        await cart.save()
        const cartData = await getFormattedCart(userID)

        return res.status(200)
            .json({
                success: true,
                message: "Item removed from cart successfully",
                ...cartData
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

