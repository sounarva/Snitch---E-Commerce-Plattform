import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

const getFormattedCart = async (cart) => {
    await cart.populate("items.product")

    const formattedCartItems = cart.items.map((item) => {
        const product = item.product
        if (!product) return null

        const variant = product.variants?.find(
            v => item.variant && v._id.toString() === item.variant.toString()
        )

        return {
            _id: item._id,
            productId: product._id,
            title: product.title,
            price: product.price,
            color: variant?.color || "",
            size: item.size,
            quantity: item.quantity,
            image: variant?.images?.[0]?.url || product.images?.[0]?.url
        }
    }).filter(Boolean)

    return formattedCartItems
}

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

            const formattedCart = await getFormattedCart(cart)
            return res.status(201)
                .json({
                    success: true,
                    message: "Item added to cart successfully",
                    cart: formattedCart
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
        const formattedCart = await getFormattedCart(cart)

        return res.status(200)
            .json({
                success: true,
                message: "Item added to cart successfully",
                cart: formattedCart
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

export const fetchCartController = async (req, res) => {
    try {
        const userID = req.user.id || req.user._id
        const cart = await cartModel.findOne({ user: userID })

        if (!cart) {
            return res.status(200)
                .json({
                    success: true,
                    message: "Cart is empty",
                    cart: []
                })
        }

        const formattedCart = await getFormattedCart(cart)

        return res.status(200)
            .json({
                success: true,
                message: "Cart fetched successfully",
                cart: formattedCart
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

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
        const formattedCart = await getFormattedCart(cart)

        return res.status(200)
            .json({
                success: true,
                message: "Cart updated successfully",
                cart: formattedCart
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

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
        const formattedCart = await getFormattedCart(cart)

        return res.status(200)
            .json({
                success: true,
                message: "Item removed from cart successfully",
                cart: formattedCart
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Internal server error"
            })
    }
}

