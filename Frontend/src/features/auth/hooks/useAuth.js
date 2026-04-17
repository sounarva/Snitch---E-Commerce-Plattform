import { setUsers, setLoading, setError } from "../state/auth.slice"
import { useDispatch, useSelector } from "react-redux"
import { regsiterAPI, loginAPI, getmeAPI, logoutAPI } from "../services/auth.api"

const useAuth = () => {
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector((state) => state.auth)

    const register = async ({ fullname, email, password, contactNumber, isSeller }) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await regsiterAPI({ fullname, email, password, contactNumber, isSeller })
            dispatch(setUsers(response.user))
            return { success: true }
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || "Registration failed"
            dispatch(setError(errMsg))
            return { success: false, error: errMsg }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const login = async ({ email, password }) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await loginAPI({ email, password })
            dispatch(setUsers(response.user))
            return { success: true }
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || "Login failed"
            dispatch(setError(errMsg))
            return { success: false, error: errMsg }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const getme = async () => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await getmeAPI()
            dispatch(setUsers(response.user))
            return { success: true }
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || "Get me failed"
            dispatch(setError(errMsg))
            return { success: false, error: errMsg }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const logout = async () => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const response = await logoutAPI()
            dispatch(setUsers(null))
            return { success: true }
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || "Logout failed"
            dispatch(setError(errMsg))
            return { success: false, error: errMsg }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        user,
        loading,
        error,
        register,
        login,
        getme,
        logout
    }
}

export default useAuth