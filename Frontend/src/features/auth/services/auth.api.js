import axios from "axios"

const authApiInstance = axios.create({
    baseURL: "/api/v1/auth",
    withCredentials: true
})

export const regsiterAPI = async ({ fullname, email, password, contactNumber, isSeller = false }) => {
    const response = await authApiInstance.post("/register", {
        fullname,
        email,
        password,
        contactNumber,
        isSeller
    })
    return response.data
}

export const loginAPI = async ({ email, password }) => {
    const response = await authApiInstance.post("/login", {
        email,
        password
    })
    return response.data
}

export const getmeAPI = async () => {
    const response = await authApiInstance.get("/me")
    return response.data
}