import { useState } from "react";
import { useNavigate } from "react-router";

// ─── Fallback Image SVG ─────────────────────────────────────────────
const ImagePlaceholder = () => (
    <div className="w-full h-full flex items-center justify-center bg-[#1B1B20]">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#4A4455]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    </div>
);

// ─── Product Card Component ─────────────────────────────────────────
const ProductCard = ({ product, index = 0 }) => {
    const [imgError, setImgError] = useState(false);
    const navigate = useNavigate()

    // Safely access first image
    const imageUrl = product?.images?.[0]?.url || null;
    const hasImage = imageUrl && !imgError;

    // Format currency dynamically
    const formatPrice = (price) => {
        if (!price) return "N/A";
        const { amount, currency } = price;
        if (currency === "INR") {
            return `₹${Number(amount).toLocaleString("en-IN")}`;
        }
        if (currency === "USD") {
            return `$${Number(amount).toLocaleString("en-US")}`;
        }
        return `${amount}`;
    };

    const handleSingleProduct = () => {
        navigate(`/product/${product?._id}`)
    }

    return (
        <div
            onClick={handleSingleProduct}
            id={`product-card-${product?._id || index}`}
            className="group relative bg-[#0D0D14]/80 border border-[#4A4455]/15 rounded-2xl overflow-hidden backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#7C3AED]/30 hover:shadow-[0_12px_50px_rgba(124,58,237,0.15)] cursor-pointer"
            style={{
                animation: `fadeSlideIn 0.5s ease-out ${index * 0.08}s both`,
            }}
        >
            {/* ─── Product Image ─── */}
            <div className="relative aspect-4/3 overflow-hidden bg-[#1B1B20]">
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={product?.title || "Product"}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <ImagePlaceholder />
                )}

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Subtle bottom fade (always visible) */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#0D0D14]/50 to-transparent" />
            </div>

            {/* ─── Card Content ─── */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-[#E4E1E9] font-bold text-[15px] tracking-wide mb-2 line-clamp-1 group-hover:text-[#D2BBFF] transition-colors duration-300">
                    {product?.title || "Untitled Product"}
                </h3>

                {/* Description */}
                <p className="text-[#958DA1] text-xs leading-relaxed line-clamp-2 mb-4 min-h-10">
                    {product?.description || "No description available."}
                </p>

                {/* Price + Add to Cart Row */}
                <div className="flex items-center justify-between gap-3">
                    <span className="inline-block px-3.5 py-1.5 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#D2BBFF] text-sm font-semibold tracking-wide shadow-[0_0_15px_rgba(124,58,237,0.08)]">
                        {formatPrice(product?.price)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
