import { addToCartApi, fetchCartApi, removeFromCartApi, updateCartApi } from "../services/cart.api"
import { useDispatch } from "react-redux"
import { setCart, setLoading, setError } from "../state/cart.slice"

export const useCart = () => {
    const dispatch = useDispatch()

    const addToCart = async (data) => {
        try {
            dispatch(setLoading(true))
            const response = await addToCartApi(data)
            dispatch(setCart(response.cart))
            return response
        } catch (error) {
            dispatch(setError(error.message))
            return { success: false, message: error.message }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const fetchCart = async () => {
        try {
            dispatch(setLoading(true))
            const response = await fetchCartApi()
            dispatch(setCart(response.cart))
            return response
        } catch (error) {
            dispatch(setError(error.message))
            return { success: false, message: error.message }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const updateCart = async (data) => {
        try {
            dispatch(setLoading(true))
            const response = await updateCartApi(data)
            dispatch(setCart(response.cart))
            return response
        } catch (error) {
            dispatch(setError(error.message))
            return { success: false, message: error.message }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const removeFromCart = async ({ cartItemId }) => {
        try {
            dispatch(setLoading(true))
            const response = await removeFromCartApi({ cartItemId })
            dispatch(setCart(response.cart))
            return response
        } catch (error) {
            dispatch(setError(error.message))
            return { success: false, message: error.message }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        addToCart,
        fetchCart,
        updateCart,
        removeFromCart
    }
}