import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    order: null,
    orders: [],
    loading: false,
    error: null
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        createOrderRequest: (state) => {
            state.loading = true
        },
        createOrderSuccess: (state, action) => {
            state.loading = false
            state.order = action.payload
        },
        createOrderFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        verifyPaymentRequest: (state) => {
            state.loading = true
        },
        verifyPaymentSuccess: (state, action) => {
            state.loading = false
            state.order = action.payload
        },
        verifyPaymentFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        fetchOrdersRequest: (state) => {
            state.loading = true
        },
        fetchOrdersSuccess: (state, action) => {
            state.loading = false
            state.orders = action.payload
        },
        fetchOrdersFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        }
    }
})

export const { createOrderRequest, createOrderSuccess, createOrderFailure, verifyPaymentRequest, verifyPaymentSuccess, verifyPaymentFailure, fetchOrdersRequest, fetchOrdersSuccess, fetchOrdersFailure } = orderSlice.actions
export default orderSlice.reducer