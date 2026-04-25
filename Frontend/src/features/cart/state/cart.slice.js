import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        loading: false,
        error: null,
        cart: [],
        totalPrice: 0
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setCart: (state, action) => {
            state.cart = action.payload
        },
        setTotalPrice: (state, action) => {
            state.totalPrice = action.payload
        }
    }
})

export const { setLoading, setError, setCart, setTotalPrice } = cartSlice.actions
export default cartSlice.reducer