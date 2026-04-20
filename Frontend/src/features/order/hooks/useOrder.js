import { useDispatch } from "react-redux"
import { createOrderApi, verifyPaymentApi, getOrdersApi } from "../services/order.api"
import {
    createOrderRequest,
    createOrderSuccess,
    createOrderFailure,
    verifyPaymentRequest,
    verifyPaymentSuccess,
    verifyPaymentFailure,
    fetchOrdersRequest,
    fetchOrdersSuccess,
    fetchOrdersFailure
} from "../state/order.slice"

export const useOrder = () => {
    const dispatch = useDispatch()

    const createOrder = async () => {
        try {
            dispatch(createOrderRequest())
            const response = await createOrderApi()
            dispatch(createOrderSuccess(response.order))
            return response
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Failed to create order"
            dispatch(createOrderFailure(errorMessage))
            return { success: false, message: errorMessage }
        }
    }

    const verifyPayment = async (paymentData) => {
        try {
            dispatch(verifyPaymentRequest())
            const response = await verifyPaymentApi(paymentData)
            dispatch(verifyPaymentSuccess(response.order || null))
            return response
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Failed to verify payment"
            dispatch(verifyPaymentFailure(errorMessage))
            return { success: false, message: errorMessage }
        }
    }

    const fetchOrders = async () => {
        try {
            dispatch(fetchOrdersRequest())
            const response = await getOrdersApi()
            dispatch(fetchOrdersSuccess(response.orders))
            return response
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Failed to fetch orders"
            dispatch(fetchOrdersFailure(errorMessage))
            return { success: false, message: errorMessage }
        }
    }

    return {
        createOrder,
        verifyPayment,
        fetchOrders
    }
}
