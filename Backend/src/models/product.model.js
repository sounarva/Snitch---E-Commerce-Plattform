import mongoose from "mongoose"

const variantsSchema = new mongoose.Schema({
    color: {
        type: String
    },
    images: [
        {
            url: {
                type: String
            }
        }
    ],
    sizes: [
        {
            size: {
                type: String
            },
            stock: {
                type: Number,
                default: 0
            }
        }
    ]
}, {
    _id: true
})

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["USD", "INR"],
            default: "INR"
        }
    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    variants: {
        type: [variantsSchema],
        default: []
    }
}, {
    timestamps: true
})

const productModel = mongoose.model("Product", productSchema)
export default productModel