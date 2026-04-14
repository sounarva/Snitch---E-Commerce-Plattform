import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/createProduct";

const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Welcome to Snitch</h1>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/create-product",
        element: <CreateProduct />
    }
])

export default router