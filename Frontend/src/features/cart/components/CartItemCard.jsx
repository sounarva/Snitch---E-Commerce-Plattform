import { useState } from "react";
import TrashIcon from "../../../svg/TrashIcon";
import MinusIcon from "../../../svg/MinusIcon";
import PlusIcon from "../../../svg/PlusIcon";
import { useToast } from "../../../shared/Toaster";

const CartItemCard = ({ item, index, updateCart, removeFromCart }) => {
    const [isPressed, setIsPressed] = useState(null);
    const { showToast } = useToast();

    const handleButtonClick = async (action) => {
        console.log(item);
        setIsPressed(action);
        if (action === "plus") {
            const res = await updateCart({
                cartItemId: item._id,
                quantity: item.quantity + 1
            })
            if (!res.success) {
                showToast(res.message, false);
            }
        } else if (action === "minus") {
            const res = await updateCart({
                cartItemId: item._id,
                quantity: item.quantity - 1
            })
            if (!res.success) {
                showToast(res.message, false);
            }
        } else if (action === "delete") {
            const res = await removeFromCart({ cartItemId: item._id })
            if (!res.success) {
                showToast(res.message, false);
            }
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
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${item.quantity <= 1
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

export default CartItemCard;