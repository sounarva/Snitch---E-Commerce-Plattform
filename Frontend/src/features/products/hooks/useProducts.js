import { createSellerProduct, getAllProducts, getSellerProducts, getSingleProduct, addProductVariant, searchProducts as searchProductsApi, editProduct } from "../services/products.api"
import { useDispatch } from "react-redux"
import { setLoading, setError, setSellerProducts, setAllProducts, setSingleProduct } from "../state/product.slice"

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

    const fetchAllProducts = async () => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await getAllProducts()
            dispatch(setAllProducts(response.products))
            return response
        } catch (error) {
            dispatch(setError(error.message))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    const fetchSingleProduct = async (id) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await getSingleProduct(id)
            dispatch(setSingleProduct(response.product))
            return response
        } catch (error) {
            dispatch(setError(error.message))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    const addVariant = async (productId, data) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await addProductVariant(productId, data)
            return response
        } catch (error) {
            dispatch(setError(error.message))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    const searchProducts = async (query) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await searchProductsApi(query)
            return response
        } catch (error) {
            dispatch(setError(error.message))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    const editProductDetails = async (productId, data) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await editProduct(productId, data)
            return { success: true, message: response?.message || "Product updated successfully" }
        } catch (error) {
            dispatch(setError(error.message))
            return { success: false, message: error.message || "Failed to update product" }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        createProduct,
        fetchSellerProducts,
        fetchAllProducts,
        fetchSingleProduct,
        addVariant,
        searchProducts,
        editProductDetails
    }
}