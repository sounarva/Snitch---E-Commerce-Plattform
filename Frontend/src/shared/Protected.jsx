import React from 'react'
import useAuth from '../features/auth/hooks/useAuth'
import { Navigate } from 'react-router'
import Loader from './Loader'

const Protected = ({ children, isSeller = "buyer" }) => {
    const { user, loading } = useAuth()
    if (loading) {
        return <Loader />
    }
    if (!user) {
        return <Navigate to="/login" />
    }
    if (user.role !== isSeller) {
        return <Navigate to="/" />
    }
    return (
        children
    )
}

export default Protected