import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  variant: {
    type: mongoose.Schema.Types.ObjectId
  },

  size: {
    type: String
  },

  quantity: {
    type: Number
  },

  // 💎 SNAPSHOT (VERY IMPORTANT)
  title: String,
  price: Number,
  image: String,
  color: String

}, { _id: false })

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: {
    type: [orderItemSchema],
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  razorpayOrderId: String,
  razorpayPaymentId: String

}, {
  timestamps: true
})

const orderModel = mongoose.model("Order", orderSchema)
export default orderModel