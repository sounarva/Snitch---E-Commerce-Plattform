import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export const getFormattedCart = async (cartOrUserID) => {
    const userID = cartOrUserID?.user || cartOrUserID;

    const cart = (await cartModel.aggregate(
        [
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userID)
                }
            },
            { $unwind: { path: '$items' } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'items.product'
                }
            },
            { $unwind: { path: '$items.product' } },
            {
                $unwind: { path: '$items.product.variants' }
            },
            {
                $match: {
                    $expr: {
                        $eq: [
                            '$items.variant',
                            '$items.product.variants._id'
                        ]
                    }
                }
            },
            {
                $addFields: {
                    itemPrice: {
                        price: {
                            $multiply: [
                                '$items.quantity',
                                '$items.product.price.amount'
                            ]
                        },
                        currency:
                            '$items.product.price.currency'
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    totalPrice: { $sum: '$itemPrice.price' },
                    currency: {
                        $first: '$items.product.price.currency'
                    },
                    items: { $push: '$items' }
                }
            }
        ]
    ))[0];

    if (!cart) {
        return { cart: [] };
    }

    const formattedCartItems = cart.items.map((item) => {
        const product = item.product;

        if (!product) return null;

        const variant = product.variants;

        return {
            _id: item._id,
            productId: product._id,
            variantId: item.variant,
            title: product.title,
            price: product.price,
            color: variant?.color || "",
            size: item.size,
            quantity: item.quantity,
            image: variant?.images?.[0]?.url || product.images?.[0]?.url,
            totalPrice: cart.totalPrice || 0
        };
    }).filter(Boolean);

    return {
        cart: formattedCartItems
    };
}