import axios from "axios"

const productsApiInstance = axios.create({
    baseURL: "/api/v1/product",
    withCredentials: true
})

export const createSellerProduct = async (data) => {
    const response = await productsApiInstance.post("/create-product", data)
    return response.data
}

export const getSellerProducts = async () => {
    const response = await productsApiInstance.get("/seller-products")
    return response.data
}

export const getAllProducts = async () => {
    const response = await productsApiInstance.get("/all-products")
    return response.data
}

export const getSingleProduct = async (id) => {
    const response = await productsApiInstance.get(`/all-products/${id}`)
    return response.data
}

export const addProductVariant = async (productId, data) => {
    const response = await productsApiInstance.post(`/add-variant/${productId}`, data)
    return response.data
}