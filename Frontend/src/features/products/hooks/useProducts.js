import { createSellerProduct, getSellerProducts } from "../services/products.api"
import { useDispatch } from "react-redux"
import { setLoading, setError, setSellerProducts } from "../state/product.slice"

export const useProducts = () => {
    const dispatch = useDispatch()

    const createProduct = async (data) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await createSellerProduct(data)
            return response
        } catch (error) {
            dispatch(setError(error.message))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    const fetchSellerProducts = async () => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await getSellerProducts()
            dispatch(setSellerProducts(response.products))
            return response
        } catch (error) {
            dispatch(setError(error.message))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        createProduct,
        fetchSellerProducts
    }
}