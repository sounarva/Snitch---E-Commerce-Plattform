import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart";
import { useOrder } from "../../order/hooks/useOrder";
import { useNavigate } from "react-router";
import Navbar from "../../products/components/Navbar";
import { useToast } from "../../../shared/Toaster";
import CartItemCard from "../components/CartItemCard";
import EmptyCartIcon from "../../../svg/EmptyCartIcon";
import ShoppingBagIcon from "../../../svg/ShoppingBagIcon";
import { useRazorpay } from "react-razorpay";

// ─── Main Cart Component ─────────────────────────────────────────────
const Cart = () => {
    const { fetchCart, updateCart, removeFromCart } = useCart();
    const { createOrder, verifyPayment } = useOrder();
    const { cart, totalPrice, loading } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const { error, isLoading, Razorpay } = useRazorpay();

    useEffect(() => {
        fetchCart();
    }, []);

    const handleCheckout = async () => {
        try {
            setCheckoutLoading(true);

            const getOrderRes = await createOrder();
            if (!getOrderRes.success) {
                showToast(getOrderRes.message || "Failed to create order", false);
                setCheckoutLoading(false);
                return;
            }

            const { order } = getOrderRes;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SfdW8tCLL23K9a",
                amount: order.amount,
                currency: order.currency,
                name: "Snitch",
                description: "Purchase from Snitch",
                order_id: order.id,
                handler: async function (response) {
                    const verifyRes = await verifyPayment(response);
                    if (verifyRes.success) {
                        showToast("Payment Successful", true);
                        setTimeout(() => {
                            navigate("/order");
                        }, 2000);
                    }
                },
                prefill: {
                    name: user?.name || "Customer",
                    email: user?.email || "customer@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#7C3AED",
                },
            };

            const paymentObject = new Razorpay(options);
            paymentObject.on("payment.failed", function (response) {
                showToast("Payment Failed!", false);
            });
            paymentObject.open();

        } catch (error) {
            showToast("Something went wrong during checkout.", false);
        } finally {
            setCheckoutLoading(false);
        }
    };

    // ─── Calculations ─── 
    const totalItems = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const formattedSubtotal = `₹${Number(totalPrice || 0).toLocaleString("en-IN")}`;

    const hasItems = cart && cart.length > 0;

    // ─── Loading State ───
    if (loading && (!cart || cart.length === 0)) {
        return (
            <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center font-[Poppins]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#7C3AED]/20 border-t-[#D2BBFF] rounded-full animate-spin" />
                    <span className="text-[#958DA1] text-sm tracking-widest uppercase">Loading Cart...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0F] font-[Poppins] relative">
            {/* ═══ Animated Background Gradient Orbs ═══ */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#7C3AED]/8 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute top-[40%] right-[5%] w-[350px] h-[350px] rounded-full bg-[#3B82F6]/6 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute bottom-[10%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#A78BFA]/5 blur-[100px] animate-[float_12s_ease-in-out_infinite]" />
            </div>

            {/* ═══ Navbar ═══ */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* ═══ Main Content ═══ */}
            <main className="relative z-10 max-w-[1280px] mx-auto px-8 pt-28 pb-16 animate-[fadeIn_0.6s_ease-out]">

                {hasItems ? (
                    <>
                        {/* ─── Section Header ─── */}
                        <div className="mb-10">
                            {/* Brand Pill */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 mb-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                                <span className="text-[#D2BBFF] text-[10px] uppercase tracking-[0.15em] font-medium">
                                    Shopping Cart
                                </span>
                            </div>

                            {/* Title */}
                            <h1
                                id="cart-title"
                                className="text-4xl lg:text-5xl font-bold text-[#E4E1E9] tracking-tight mb-3"
                            >
                                Your Cart
                            </h1>

                            {/* Subtitle */}
                            <p className="text-[#958DA1] text-sm tracking-wide max-w-lg">
                                Review your selected items before checkout
                            </p>

                            {/* Gradient underline */}
                            <div className="mt-5 w-20 h-[2px] bg-linear-to-r from-[#7C3AED] via-[#A78BFA] to-transparent" />
                        </div>

                        {/* ─── Two-Column Layout ─── */}
                        <div className="flex gap-8 items-start">

                            {/* ═══ LEFT: Cart Items ═══ */}
                            <div className="flex-1 flex flex-col gap-4 min-w-0">
                                {cart.map((item, index) => (
                                    <CartItemCard
                                        key={`${item.productId}-${item.color}-${item.size}-${index}`}
                                        item={item}
                                        index={index}
                                        updateCart={updateCart}
                                        removeFromCart={removeFromCart}
                                        onAction={showToast}
                                    />
                                ))}

                                {/* Items count */}
                                <div className="mt-2 flex items-center gap-2 text-[#4A4455] text-xs tracking-wide">
                                    <ShoppingBagIcon />
                                    <span>{totalItems} {totalItems === 1 ? "item" : "items"} in your cart</span>
                                </div>
                            </div>

                            {/* ═══ RIGHT: Order Summary ═══ */}
                            <div className="w-[380px] shrink-0 sticky top-28">
                                <div className="rounded-2xl border border-[#2A292F] bg-[#1B1B20]/40 backdrop-blur-xl p-7 shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
                                    {/* Header */}
                                    <h2 className="text-[#E4E1E9] font-bold text-lg tracking-tight mb-6 flex items-center gap-2">
                                        <ShoppingBagIcon />
                                        Order Summary
                                    </h2>

                                    {/* Details */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#958DA1] text-sm">Subtotal</span>
                                            <span className="text-[#E4E1E9] font-semibold text-sm">{formattedSubtotal}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#958DA1] text-sm">Total Items</span>
                                            <span className="text-[#E4E1E9] font-semibold text-sm">{totalItems}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#958DA1] text-sm">Shipping</span>
                                            <span className="text-emerald-400/80 font-semibold text-sm">Free</span>
                                        </div>
                                    </div>

                                    {/* Gradient Divider */}
                                    <div
                                        className="h-px w-full my-6"
                                        style={{
                                            background: "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.4) 50%, transparent 100%)",
                                        }}
                                    />

                                    {/* Total */}
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-[#958DA1] text-sm font-semibold uppercase tracking-widest">Total</span>
                                        <span className="text-2xl font-bold text-white">{formattedSubtotal}</span>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        id="cart-checkout-btn"
                                        onClick={handleCheckout}
                                        disabled={checkoutLoading}
                                        className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest text-white uppercase bg-linear-to-r from-[#7C3AED] to-[#3B82F6] shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all duration-300 ${checkoutLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 cursor-pointer'}`}
                                    >
                                        {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
                                    </button>

                                    {/* Continue Shopping */}
                                    <button
                                        id="cart-continue-shopping"
                                        onClick={() => navigate("/")}
                                        className="w-full mt-3 py-3 rounded-xl font-semibold text-xs tracking-widest text-[#958DA1] uppercase border border-[#2A292F] bg-transparent hover:text-[#D2BBFF] hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5 transition-all duration-300 cursor-pointer"
                                    >
                                        Continue Shopping
                                    </button>

                                    {/* Security badges */}
                                    <div className="flex items-center justify-center gap-4 mt-6 pt-4">
                                        <div className="flex items-center gap-1.5 text-[#4A4455]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                            </svg>
                                            <span className="text-[10px] tracking-wider uppercase font-medium">Secure</span>
                                        </div>
                                        <div className="w-px h-3 bg-[#2A292F]" />
                                        <div className="flex items-center gap-1.5 text-[#4A4455]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                                            </svg>
                                            <span className="text-[10px] tracking-wider uppercase font-medium">Encrypted</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* ─── Empty State ─── */
                    <div
                        id="cart-empty-state"
                        className="flex flex-col items-center justify-center text-center py-24 animate-[fadeIn_0.5s_ease-out]"
                    >
                        <div className="text-[#4A4455] mb-8 animate-[float_6s_ease-in-out_infinite]">
                            <EmptyCartIcon />
                        </div>

                        <h2 className="text-3xl font-bold text-[#E4E1E9] mb-3 tracking-tight">
                            Your cart is empty
                        </h2>

                        <p className="text-[#958DA1] max-w-md mb-8 text-sm leading-relaxed">
                            Looks like you haven't added any items to your cart yet. Explore our curated collection and find something you love.
                        </p>

                        <button
                            id="empty-cart-shop-btn"
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] hover:shadow-[0_0_35px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                            </svg>
                            Continue Shopping
                        </button>
                    </div>
                )}
            </main>

            {/* ═══ Footer ═══ */}
            <footer className="relative z-10 pb-8 pt-12">
                <div className="max-w-[1280px] mx-auto px-8">
                    {/* Gradient divider */}
                    <div
                        className="h-px mb-8"
                        style={{
                            background: "linear-gradient(90deg, transparent 0%, rgba(74,68,85,0.3) 30%, rgba(74,68,85,0.3) 70%, transparent 100%)",
                        }}
                    />
                    <p className="text-[#4A4455] text-[10px] tracking-[0.2em] font-medium uppercase text-center">
                        © 2026 Snitch — Curated Digital Fashion
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default Cart;