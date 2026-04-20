import axios from "axios"

const orderApiInstance = axios.create({
    baseURL: "/api/v1/order",
    withCredentials: true
})

/**
 * Creates a Razorpay order on the backend.
 * This initiates the payment process by generating a Razorpay Order ID.
 * @returns {Promise<Object>} The server response containing the Razorpay order object.
 */
export const createOrderApi = async () => {
    const response = await orderApiInstance.post("/create-order")
    return response.data
}

/**
 * Verifies the Razorpay payment signature and completes the order in the database.
 * @param {Object} paymentData - The payment signature data from Razorpay.
 * @param {string} paymentData.razorpay_order_id - The ID of the Razorpay order.
 * @param {string} paymentData.razorpay_payment_id - The ID of the Razorpay payment.
 * @param {string} paymentData.razorpay_signature - The signature for verification.
 * @returns {Promise<Object>} The server response indicating success or failure.
 */
export const verifyPaymentApi = async (paymentData) => {
    const response = await orderApiInstance.post("/verify-payment", paymentData)
    return response.data
}

export const getOrdersApi = async () => {
    const response = await orderApiInstance.get("/")
    return response.data
}
