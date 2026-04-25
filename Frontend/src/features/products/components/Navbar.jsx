import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUsers } from "../../auth/state/auth.slice";
import useAuth from "../../auth/hooks/useAuth"
import SearchBar from "./SearchBar";
import CartIcon from "../../../svg/CartIcon";
import OrdersIcon from "../../../svg/OrdersIcon";
import ProfileIcon from "../../../svg/ProfileIcon";
import PlusIcon from "../../../svg/PlusIcon";
import SpinnerIcon from "../../../svg/SpinnerIcon";
import LogoutIcon from "../../../svg/LogoutIcon";

// ─── Navbar Component ───────────────────────────────────────────────
const Navbar = () => {
    const { user, logout, loading } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        const res = await logout()
        if (res.success) {
            dispatch(setUsers(null))
            navigate("/login")
        }
    };

    // Extract username prefix from email
    const getUsername = (email) => {
        if (!email) return "";
        return email.split("@")[0];
    };

    const isSeller = user?.role === "seller";

    return (
        <nav
            id="snitch-navbar"
            className="fixed top-0 left-0 right-0 z-50 font-[Poppins]"
            style={{
                background: "rgba(10, 10, 15, 0.8)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
            }}
        >
            <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-4">
                {/* ─── Logo ─── */}
                <button
                    id="snitch-logo"
                    onClick={() => navigate("/")}
                    className="cursor-pointer bg-transparent border-none outline-none"
                >
                    <h1
                        className="text-xl font-bold tracking-[0.35em] uppercase select-none"
                        style={{
                            background: "linear-gradient(90deg, #E4E1E9 0%, #A78BFA 50%, #E4E1E9 100%)",
                            backgroundSize: "200% auto",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            animation: "loaderShimmer 4s linear infinite",
                        }}
                    >
                        Snitch
                    </h1>
                </button>

                {/* ─── Search Bar ─── */}
                <div className="hidden lg:flex flex-1 max-w-md mx-8">
                    <SearchBar />
                </div>

                {/* ─── Right Side: Actions ─── */}
                <div className="flex items-center gap-2">
                    {/* Seller-Only Buttons */}
                    {isSeller && (
                        <div className="flex items-center gap-4 mr-2">
                            <button
                                id="nav-add-product"
                                onClick={() => navigate("/seller/create-product")}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wider text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                <PlusIcon />
                                <span>Add</span>
                            </button>

                            <button
                                id="nav-my-products"
                                onClick={() => navigate("/seller/show-product")}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wider text-[#D2BBFF] border border-[#7C3AED]/40 bg-[#7C3AED]/8 transition-all duration-300 hover:bg-[#7C3AED]/15 hover:border-[#7C3AED]/60 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                    <line x1="12" y1="22.08" x2="12" y2="12" />
                                </svg>
                                <span>Products</span>
                            </button>
                        </div>
                    )}

                    {/* Nav Icons */}
                    <button
                        onClick={() => navigate("/cart")}
                        id="nav-cart"
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[#958DA1] hover:text-[#D2BBFF] hover:bg-[#7C3AED]/10 transition-all duration-300 cursor-pointer bg-transparent border-none outline-none"
                        title="Cart"
                    >
                        <CartIcon />
                    </button>

                    {user ? (
                        <>
                            <button
                                id="nav-orders"
                                onClick={() => navigate("/order")}
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#958DA1] hover:text-[#D2BBFF] hover:bg-[#7C3AED]/10 transition-all duration-300 cursor-pointer bg-transparent border-none outline-none"
                                title="Orders"
                            >
                                <OrdersIcon />
                            </button>

                            {/* Profile Section with Dropdown */}
                            <div className="relative flex items-center ml-1">
                                <button
                                    id="nav-profile"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer bg-transparent border-none outline-none ${isProfileOpen ? "text-[#D2BBFF] bg-[#7C3AED]/15" : "text-[#958DA1] hover:text-[#D2BBFF] hover:bg-[#7C3AED]/10"
                                        }`}
                                    title="Profile"
                                >
                                    <ProfileIcon />
                                </button>

                                {/* Username */}
                                <span
                                    id="nav-username"
                                    className="ml-1 text-[#958DA1] text-xs font-medium tracking-wider select-none cursor-pointer"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    {getUsername(user.email)}
                                </span>

                                {/* Profile Dropdown */}
                                <div
                                    className={`absolute top-full right-0 mt-4 w-60 rounded-2xl border border-[#4A4455]/30 bg-[#0D0D14]/90 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl origin-top transition-all duration-300 ${isProfileOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"
                                        }`}
                                >
                                    <div className="mb-4 text-left">
                                        <p className="text-[10px] uppercase tracking-widest text-[#7C3AED] font-bold mb-1">
                                            {user.role || (isSeller ? "Seller" : "Buyer")} Account
                                        </p>
                                        <p className="text-sm text-[#E4E1E9] font-medium truncate">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="h-px w-full bg-linear-to-r from-transparent via-[#4A4455]/40 to-transparent mb-3" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-[#ffb4ab] bg-[#93000a]/20 transition-all duration-300 cursor-pointer hover:bg-[#93000a]/40"
                                    >

                                        {loading ? (
                                            <>
                                                <SpinnerIcon />
                                                Logging Out...
                                            </>
                                        ) : (
                                            <>
                                                <LogoutIcon />
                                                Logout
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 ml-2">
                            <button
                                onClick={() => navigate("/login")}
                                className="px-5 py-2 rounded-full font-semibold text-xs uppercase tracking-wider text-[#D2BBFF] border border-[#7C3AED]/40 bg-[#7C3AED]/8 transition-all duration-300 hover:bg-[#7C3AED]/15 hover:border-[#7C3AED]/60 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="px-5 py-2 rounded-full font-semibold text-xs uppercase tracking-wider text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Bottom Gradient Line ─── */}
            <div
                className="h-px w-full"
                style={{
                    background: "linear-gradient(90deg, transparent 0%, #7C3AED 30%, #3B82F6 70%, transparent 100%)",
                    opacity: 0.4,
                }}
            />
        </nav>
    );
};

export default Navbar;
