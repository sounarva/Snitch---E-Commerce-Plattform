import { createSlice } from "@reduxjs/toolkit"

const productSlice = createSlice({
    name: "product",
    initialState: {
        loading: false,
        error: null,
        sellerProducts: [],
        allProducts: [],
        singleProduct: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload
        },
        setSingleProduct: (state, action) => {
            state.singleProduct = action.payload
        }
    }
})

export const { setLoading, setError, setSellerProducts, setAllProducts, setSingleProduct } = productSlice.actions
export default productSlice.reducer