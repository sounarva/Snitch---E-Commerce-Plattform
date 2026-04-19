import cartModel from "../models/cart.model.js";

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
            const reqVariantStr = variantId ? variantId : null;
            const isSameVariant = itemVariantStr === reqVariantStr;
            const isSameSize = (item.size || null) === (size || null);
            return isSameProduct && isSameVariant && isSameSize;
        });

        if (existingItem) {
            existingItem.quantity += quantity
        } else {
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

        if (quantity <= 0) {
            cart.items.pull(cartItemId)
        } else {
            existingItem.quantity = quantity
        }
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

