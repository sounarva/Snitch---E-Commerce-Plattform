import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    variant: {
        type: mongoose.Schema.Types.ObjectId
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    size: {
        type: String
    }
}, {
    _id: true
})

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: {
        type: [cartItemSchema],
        default: []
    }
}, {
    timestamps: true
})

const cartModel = mongoose.model("Cart", cartSchema)
export default cartModel