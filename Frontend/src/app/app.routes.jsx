import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/createProduct";
import ShowProduct from "../features/products/pages/ShowProduct";
import Protected from "../shared/Protected";

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
        path: "/seller/create-product",
        element: <Protected isSeller="seller"><CreateProduct /></Protected>
    },
    {
        path: "/seller/show-product",
        element: <Protected isSeller="seller"><ShowProduct /></Protected>
    }
])

export default router