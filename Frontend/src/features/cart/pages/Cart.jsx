import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router";
import Navbar from "../../products/components/Navbar";

// ─── SVG Icons ───────────────────────────────────────────────────────
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const EmptyCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);

const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

// ─── Toast Component ─────────────────────────────────────────────────
const Toast = ({ message, visible }) => (
    <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-100 px-6 py-3 rounded-2xl border border-[#7C3AED]/30 bg-[#1B1B20]/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-[#D2BBFF] text-sm font-medium tracking-wide transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
    >
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            {message}
        </div>
    </div>
);

// ─── Cart Item Card ──────────────────────────────────────────────────
const CartItemCard = ({ item, index, updateCart, removeFromCart }) => {
    const [isPressed, setIsPressed] = useState(null); // track which button is pressed

    const handleButtonClick = (action) => {
        setIsPressed(action);
        if (action === "plus") {
            updateCart({
                cartItemId: item._id,
                quantity: item.quantity + 1
            })
        } else if (action === "minus") {
            updateCart({
                cartItemId: item._id,
                quantity: item.quantity - 1
            })
        } else if (action === "delete") {
            removeFromCart({ cartItemId: item._id })
        }
        setTimeout(() => setIsPressed(null), 300);
    };

    const getFormattedPrice = (price) => {
        if (!price) return "N/A";
        let { amount, currency } = price;
        if (currency === "USD") {
            amount = amount * 83;
        }
        return `₹${Number(amount).toLocaleString("en-IN")}`;
    };

    const itemBasePrice = item.price?.currency === "USD" ? (item.price.amount || 0) * 83 : (item.price?.amount || 0);
    const itemTotal = itemBasePrice * item.quantity;
    const formattedItemTotal = `₹${Number(itemTotal).toLocaleString("en-IN")}`;

    return (
        <div
            id={`cart-item-${index}`}
            className="group relative flex items-center gap-6 p-5 rounded-2xl border border-[#2A292F] bg-[#1B1B20]/60 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(124,58,237,0.08)] hover:border-[#7C3AED]/30"
            style={{ animation: `cartItemFadeIn 0.5s ease-out ${index * 0.08}s both` }}
        >
            {/* Hover glow border effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px rgba(124,58,237,0.15), 0 0 30px rgba(124,58,237,0.05)" }}
            />

            {/* ─── Product Image ─── */}
            <div className="w-[100px] h-[120px] rounded-xl overflow-hidden bg-[#2A292F] border border-[#35343A]/50 shrink-0 group/img">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4A4455]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                    </div>
                )}
            </div>

            {/* ─── Product Info (Center) ─── */}
            <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="text-[#E4E1E9] font-bold text-[15px] tracking-tight mb-2.5 line-clamp-1">
                    {item.title}
                </h3>

                {/* Badges Row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {item.color && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-[0.12em] font-semibold text-[#D2BBFF] bg-[#7C3AED]/10 border border-[#7C3AED]/15">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color.toLowerCase() === "black" ? "#333" : item.color.toLowerCase() === "white" ? "#f0f0f0" : item.color.toLowerCase() }} />
                            {item.color}
                        </span>
                    )}
                    {item.size && (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-[0.12em] font-semibold text-[#93C5FD] bg-[#3B82F6]/10 border border-[#3B82F6]/15">
                            {item.size}
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                    <span className="text-[#E4E1E9] font-bold text-lg tracking-tight">
                        {getFormattedPrice(item.price)}
                    </span>
                    {item.quantity > 1 && (
                        <span className="text-[#958DA1] text-xs font-medium">
                            × {item.quantity} = <span className="text-[#D2BBFF] font-semibold">{formattedItemTotal}</span>
                        </span>
                    )}
                </div>
            </div>

            {/* ─── Actions (Right) ─── */}
            <div className="flex items-center gap-4 shrink-0">
                {/* Quantity Controls */}
                <div className="flex items-center gap-1 rounded-xl border border-[#2A292F] bg-[#0A0A0F]/60 p-1">
                    <button
                        id={`cart-minus-${index}`}
                        onClick={() => handleButtonClick("minus")}
                        disabled={item.quantity <= 1}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            item.quantity <= 1 
                            ? "text-[#4A4455] cursor-not-allowed opacity-50" 
                            : "text-[#958DA1] hover:text-[#D2BBFF] hover:bg-[#7C3AED]/15 active:scale-90 cursor-pointer"
                        } ${isPressed === "minus" ? "scale-90 bg-[#7C3AED]/20" : ""}`}
                    >
                        <MinusIcon />
                    </button>
                    <span className="w-10 text-center text-[#E4E1E9] font-bold text-sm tabular-nums select-none">
                        {item.quantity}
                    </span>
                    <button
                        id={`cart-plus-${index}`}
                        onClick={() => handleButtonClick("plus")}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-[#958DA1] transition-all duration-300 hover:text-[#D2BBFF] hover:bg-[#7C3AED]/15 active:scale-90 cursor-pointer ${isPressed === "plus" ? "scale-90 bg-[#7C3AED]/20" : ""}`}
                    >
                        <PlusIcon />
                    </button>
                </div>

                {/* Delete Button */}
                <button
                    id={`cart-delete-${index}`}
                    onClick={() => handleButtonClick("delete")}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-[#958DA1] border border-[#2A292F] bg-[#0A0A0F]/40 transition-all duration-300 hover:text-[#ffb4ab] hover:bg-[#93000a]/15 hover:border-[#93000a]/30 active:scale-90 cursor-pointer ${isPressed === "delete" ? "scale-90 bg-[#93000a]/25" : ""}`}
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

// ─── Main Cart Component ─────────────────────────────────────────────
const Cart = () => {
    const { fetchCart, updateCart, removeFromCart } = useCart();
    const { cart, loading } = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const [toastMsg, setToastMsg] = useState("");
    const [toastVisible, setToastVisible] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const showToast = (msg) => {
        setToastMsg(msg);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2000);
    };

    // ─── Calculations ─── 
    const totalItems = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const subtotal = cart?.reduce((acc, item) => {
        const itemAmount = item.price?.currency === "USD" ? (item.price.amount * 83) : (item.price?.amount || 0);
        return acc + itemAmount * item.quantity;
    }, 0) || 0;
    const formattedSubtotal = `₹${Number(subtotal).toLocaleString("en-IN")}`;

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
                                        onClick={() => showToast("Feature coming soon")}
                                        className="w-full py-4 rounded-xl font-bold text-sm tracking-widest text-white uppercase bg-linear-to-r from-[#7C3AED] to-[#3B82F6] shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 cursor-pointer"
                                    >
                                        Proceed to Checkout
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

            {/* ═══ Toast Notification ═══ */}
            <Toast message={toastMsg} visible={toastVisible} />
        </div>
    );
};

export default Cart;