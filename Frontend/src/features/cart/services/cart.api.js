import axios from "axios"
const cartApiInstance = axios.create({
    baseURL: "/api/v1/cart",
    withCredentials: true
})

export const addToCartApi = async (data) => {
    const response = await cartApiInstance.post("/add-to-cart", data)
    return response.data
}

export const fetchCartApi = async () => {
    const response = await cartApiInstance.get("/fetch-cart")
    return response.data
}

export const updateCartApi = async (data) => {
    const response = await cartApiInstance.put("/update-cart", data)
    return response.data
}

export const removeFromCartApi = async ({ cartItemId }) => {
    const response = await cartApiInstance.delete("/remove-from-cart", {
        data: { cartItemId }
    })
    return response.data
}
