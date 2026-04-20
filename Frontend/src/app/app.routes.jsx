import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/createProduct";
import ShowProduct from "../features/products/pages/ShowProduct";
import Home from "../features/products/pages/Home";
import Protected from "../shared/Protected";
import SingleProduct from "../features/products/pages/SingleProduct";
import AddVariants from "../features/products/pages/AddVariants";
import Cart from "../features/cart/pages/Cart";
import Order from "../features/order/pages/Order";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
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
    },
    {
        path: "/product/:id",
        element: <SingleProduct />
    },
    {
        path: "/seller/add-variants/:id",
        element: <Protected isSeller="seller"><AddVariants /></Protected>
    },
    {
        path: "/cart",
        element: <Cart />
    },
    {
        path: "/order",
        element: <Order />
    }
])

export default router