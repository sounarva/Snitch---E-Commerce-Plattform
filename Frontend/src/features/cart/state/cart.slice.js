import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        loading: false,
        error: null,
        cart: []
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
        }
    }
})

export const { setLoading, setError, setCart } = cartSlice.actions
export default cartSlice.reducer