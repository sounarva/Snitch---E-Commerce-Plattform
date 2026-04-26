import { useState, useCallback } from "react";
import { useNavigate } from "react-router";

// ─── Fallback Image SVG ─────────────────────────────────────────────
const ImagePlaceholder = () => (
    <div className="w-full h-full flex items-center justify-center bg-[#1a1a24]">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#3a3a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    </div>
);

// ─── Product Card Component ─────────────────────────────────────────
const ProductCard = ({ product, index = 0 }) => {
    const [imgErrors, setImgErrors] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const navigate = useNavigate();

    const images = product?.images || [];
    const totalSlides = images.length;

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
        navigate(`/product/${product?._id}`);
    };

    const handleImageError = useCallback((idx) => {
        setImgErrors((prev) => ({ ...prev, [idx]: true }));
    }, []);

    // Slider navigation
    const goToSlide = (idx, e) => {
        e.stopPropagation();
        setCurrentSlide(idx);
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSlide < totalSlides - 1) {
                setCurrentSlide((prev) => prev + 1);
            } else if (diff < 0 && currentSlide > 0) {
                setCurrentSlide((prev) => prev - 1);
            }
        }
        setTouchStartX(null);
    };

    return (
        <div
            id={`product-card-${product?._id || index}`}
            className="group relative bg-[#141418] border border-[#2a2a32] rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:border-[#3a3a44]"
            style={{
                animation: `fadeSlideIn 0.5s ease-out ${index * 0.08}s both`,
            }}
        >
            {/* ─── Image Slider Section ─── */}
            <div
                className="relative aspect-square overflow-hidden bg-[#1a1a24]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Slides Container */}
                {totalSlides > 0 ? (
                    <div
                        className="flex h-full transition-transform duration-500 ease-out"
                        style={{
                            width: `${totalSlides * 100}%`,
                            transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
                        }}
                    >
                        {images.map((img, idx) => (
                            <div
                                key={img._id || idx}
                                className="h-full shrink-0"
                                style={{ width: `${100 / totalSlides}%` }}
                            >
                                {imgErrors[idx] ? (
                                    <ImagePlaceholder />
                                ) : (
                                    <img
                                        src={img.url}
                                        alt={`${product?.title || "Product"} - ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={() => handleImageError(idx)}
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <ImagePlaceholder />
                )}

                {/* Category Badge (top-left) */}
                {product?.category && (
                    <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white bg-[#0d0d14]/70 backdrop-blur-md rounded-lg border border-white/10">
                            {product.category}
                        </span>
                    </div>
                )}

                {/* Left/Right Arrow Nav (only if multiple images) */}
                {totalSlides > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#0d0d14]/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#0d0d14]/80 hover:scale-110"
                            aria-label="Previous image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#0d0d14]/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#0d0d14]/80 hover:scale-110"
                            aria-label="Next image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </>
                )}

                {/* Dot Indicators */}
                {totalSlides > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => goToSlide(idx, e)}
                                className={`rounded-full transition-all duration-300 ${currentSlide === idx
                                        ? "w-2 h-2 bg-white"
                                        : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Card Content ─── */}
            <div className="p-5">
                {/* Product Title */}
                <h3 className="text-[#e8e8ec] font-bold text-[16px] leading-snug mb-1 line-clamp-1 tracking-tight">
                    {product?.title || "Untitled Product"}
                </h3>

                {/* Description */}
                <p className="text-[#7a7a88] text-[13px] leading-relaxed line-clamp-2 mb-5 min-h-[40px]">
                    {product?.description || "No description available."}
                </p>

                {/* Price + Buy Now Row */}
                <div className="flex items-center justify-between gap-3">
                    {/* Price Pill */}
                    <span className="inline-flex items-center px-4 py-2 rounded-xl bg-[#1e1e28] border border-[#2e2e3a] text-[#e8e8ec] text-sm font-bold tracking-wide">
                        {formatPrice(product?.price)}
                    </span>

                    {/* Buy Now Button */}
                    <span
                        onClick={handleSingleProduct}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e8e8ec] text-[#0d0d14] text-sm font-bold tracking-wide transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                        View Product
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
