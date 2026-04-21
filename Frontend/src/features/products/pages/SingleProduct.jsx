import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProducts } from "../hooks/useProducts";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { COLOR_HEX_MAP } from "../../../data/data";
import { useCart } from "../../cart/hooks/useCart";
import { useToast } from "../../../shared/Toaster";
import SpinnerIcon from "../../../svg/SpinnerIcon";

const getSwatchColor = (name) => COLOR_HEX_MAP[name?.toLowerCase()] || "#7C3AED";

const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchSingleProduct, fetchAllProducts } = useProducts();
    const { singleProduct, allProducts, loading } = useSelector((state) => state.product);
    const { showToast } = useToast();
    const { addToCart } = useCart();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    /* ─── Variant state ─── */
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null); // null = default (no variant)
    const [selectedSize, setSelectedSize] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [localStockDecrements, setLocalStockDecrements] = useState({});

    useEffect(() => {
        setLocalStockDecrements({});
    }, [singleProduct?._id]);

    // Fetch product details
    useEffect(() => {
        if (id) {
            const product = async () => {
                const res = await fetchSingleProduct(id);
                if (res.success) {
                    setCurrentImageIndex(0);
                    setSelectedVariantIndex(null);
                    setSelectedSize(null);
                    window.scrollTo(0, 0);
                }
            };
            product();
        }
    }, [id]);

    // Fetch all products for the recommendations section
    useEffect(() => {
        if (allProducts.length === 0) {
            fetchAllProducts();
        }
    }, [allProducts.length]);

    const product = singleProduct;
    const variants = product?.variants || [];
    const hasVariants = variants.length > 0;

    /* ─── Derive the active image list ─── */
    const activeImages = useMemo(() => {
        if (selectedVariantIndex !== null && variants[selectedVariantIndex]?.images?.length > 0) {
            return variants[selectedVariantIndex].images;
        }
        return product?.images || [];
    }, [product, selectedVariantIndex, variants]);

    const hasMultipleImages = activeImages.length > 1;

    /* ─── Active variant sizes ─── */
    const activeSizes = useMemo(() => {
        if (selectedVariantIndex !== null) {
            return variants[selectedVariantIndex]?.sizes || [];
        }
        return [];
    }, [selectedVariantIndex, variants]);

    /* ─── Stock helper ─── */
    const selectedStock = useMemo(() => {
        if (!selectedSize || selectedVariantIndex === null) return null;
        const sizeObj = activeSizes.find((s) => s.size === selectedSize);
        if (sizeObj) {
            const variantId = variants[selectedVariantIndex]?._id;
            const decrement = (variantId && localStockDecrements[`${variantId}_${selectedSize}`]) || 0;
            return Math.max(0, sizeObj.stock - decrement);
        }
        return null;
    }, [selectedSize, selectedVariantIndex, activeSizes, localStockDecrements, variants]);

    /* ─── Image navigation ─── */
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % activeImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);

    /* ─── Variant selection handlers ─── */
    const handleVariantSelect = (idx) => {
        if (selectedVariantIndex === idx) {
            // Deselect → back to default
            setSelectedVariantIndex(null);
            setSelectedSize(null);
            setCurrentImageIndex(0);
        } else {
            setSelectedVariantIndex(idx);
            setSelectedSize(null);
            setCurrentImageIndex(0);
        }
    };

    const handleSizeSelect = (sizeName) => {
        setSelectedSize((prev) => (prev === sizeName ? null : sizeName));
    };

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        const activeVariant = selectedVariantIndex !== null ? product.variants[selectedVariantIndex] : null;

        const data = {
            productId: product._id,
            variantId: activeVariant ? activeVariant._id : null,
            size: selectedSize,
            quantity: 1
        }
        const res = await addToCart(data);
        if (res.success) {
            showToast("Item added to cart", true);
            if (activeVariant) {
                setLocalStockDecrements((prev) => ({
                    ...prev,
                    [`${activeVariant._id}_${selectedSize}`]: (prev[`${activeVariant._id}_${selectedSize}`] || 0) + 1
                }));
            }
        } else {
            showToast(res.message || "Failed to add to cart", false);
        }
        setIsAddingToCart(false);
    }

    // Pricing & Conversion
    const getFormattedPrices = (priceObj) => {
        if (!priceObj) return { main: "N/A", sub: "" };
        const { amount, currency } = priceObj;
        if (currency === "INR") {
            const usdAppx = (amount / 83).toFixed(2);
            return {
                main: `₹${Number(amount).toLocaleString("en-IN")}`,
                sub: `$${usdAppx} (approx)`,
            };
        } else if (currency === "USD") {
            const inrAppx = (amount * 83).toFixed(2);
            return {
                main: `$${Number(amount).toLocaleString("en-US")}`,
                sub: `₹${Number(inrAppx).toLocaleString("en-IN")} (approx)`,
            };
        }
        return { main: `${amount}`, sub: "" };
    };

    const { main: mainPrice, sub: subPrice } = getFormattedPrices(product?.price);

    // Other Products (filter out current)
    const otherProducts = allProducts.filter((p) => p._id !== id).slice(0, 10);


    // Loader State
    if (loading && !product) {
        return (
            <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center font-[Poppins]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#7C3AED]/20 border-t-[#D2BBFF] rounded-full animate-spin"></div>
                    <span className="text-[#958DA1] text-sm tracking-widest uppercase">Loading Product...</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0A0A0F] pt-24 font-[Poppins] flex flex-col items-center justify-center">
                <Navbar />
                <h1 className="text-3xl text-[#E4E1E9] font-bold mb-4">Product Not Found</h1>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 rounded-xl text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all font-semibold tracking-wide"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0F] font-[Poppins] relative pt-5">
            {/* ═══ Animated Background Gradients ═══ */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#7C3AED]/10 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] rounded-full bg-[#3B82F6]/5 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
            </div>

            {/* ═══ Navbar ═══ */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* ═══ Main Content ═══ */}
            <main className="relative z-10 max-w-[1280px] mx-auto px-8 py-20 animate-[fadeIn_0.5s_ease-out]">

                {/* ─── Product Section (Top) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 pt-4 lg:pt-8">

                    {/* ══════ LEFT SIDE: Image Gallery ══════ */}
                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start lg:sticky lg:top-28 h-fit">
                        <div className="flex gap-3 md:gap-4 w-full max-w-[400px] md:max-w-[450px]">
                            {/* Vertical Thumbnails Strip */}
                            {hasMultipleImages && (
                                <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[420px] md:max-h-[500px] pr-1.5 shrink-0" style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4455 transparent" }}>
                                    {activeImages.map((img, idx) => (
                                        <button
                                            key={img._id || idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`shrink-0 w-12 h-14 md:w-14 md:h-16 rounded-lg overflow-hidden border-[1.5px] transition-all duration-300 ${currentImageIndex === idx
                                                ? "border-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.35)]"
                                                : "border-transparent opacity-60 hover:opacity-100 bg-[#1B1B20]"
                                                }`}
                                        >
                                            <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image Container */}
                            <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-[#1B1B20] border border-[#2A292F] shadow-[0_15px_40px_rgba(0,0,0,0.4)] group">
                                {activeImages.length > 0 ? (
                                    <img
                                        key={activeImages[currentImageIndex]?.url}
                                        src={activeImages[currentImageIndex]?.url}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        style={{ animation: "fadeIn 0.35s ease-out" }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#4A4455]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                            <circle cx="9" cy="9" r="2" />
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                        </svg>
                                        <span className="text-sm">No Image Available</span>
                                    </div>
                                )}

                                {/* Overlay Gradient on Hover */}
                                <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Arrow Navigation (Conditional) */}
                                {hasMultipleImages && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1B1B20]/60 backdrop-blur-md border border-[#4A4455]/50 flex items-center justify-center text-[#E4E1E9] transition-all hover:bg-[#7C3AED]/80 hover:scale-110 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] opacity-0 group-hover:opacity-100 z-10"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 -ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1B1B20]/60 backdrop-blur-md border border-[#4A4455]/50 flex items-center justify-center text-[#E4E1E9] transition-all hover:bg-[#7C3AED]/80 hover:scale-110 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] opacity-0 group-hover:opacity-100 z-10"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 -mr-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ══════ RIGHT SIDE: Product Details ══════ */}
                    <div className="lg:col-span-7 flex flex-col justify-start">
                        {/* Badges */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[#D2BBFF] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                                Premium Edition
                            </span>
                            {hasVariants && (
                                <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[#93C5FD] bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full">
                                    {variants.length} {variants.length === 1 ? "Variant" : "Variants"}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#E4E1E9] tracking-tight leading-tight mb-6">
                            {product.title}
                        </h1>

                        {/* Styling Divider */}
                        <div className="w-16 h-1 bg-linear-to-r from-[#7C3AED] to-[#3B82F6] rounded-full mb-8" />

                        {/* Description */}
                        <div className="text-[#958DA1] text-[15px] leading-relaxed mb-10 min-h-20">
                            {product.description ? (
                                <p className="whitespace-pre-wrap">{product.description}</p>
                            ) : (
                                <p className="italic">No description provided for this product.</p>
                            )}
                        </div>

                        {/* ─── Variants Section ─── */}
                        {hasVariants && (
                            <div className="mb-8 space-y-6">

                                {/* ── Color Selector ── */}
                                <div>
                                    <p className="text-[#958DA1] text-xs uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" /><circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" /><path d="M12 22C6 22 2 17.5 2 12S6 2 12 2s10 4.5 10 10c0 2-1 3.5-3 3.5h-1.6c-.8 0-1.4.7-1.4 1.5 0 .4.1.7.3 1 .2.3.3.6.3 1 0 1.1-.9 2-2 2" /></svg>
                                        Variant — <span className="text-[#D2BBFF]">{selectedVariantIndex !== null ? (variants[selectedVariantIndex].color || "Default") : "Select"}</span>
                                    </p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {variants.map((variant, idx) => {
                                            const isActive = selectedVariantIndex === idx;
                                            const hex = getSwatchColor(variant.color);
                                            const hasColor = !!variant.color;
                                            const hasVariantImage = variant.images?.length > 0;
                                            const fallbackImgUrl = (!hasColor && !hasVariantImage && product?.images?.length > 0) ? product.images[0].url : null;

                                            return (
                                                <button
                                                    key={variant._id}
                                                    onClick={() => handleVariantSelect(idx)}
                                                    title={variant.color || "Default Variant"}
                                                    className={`relative group/swatch flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 ${isActive
                                                        ? "border-[#7C3AED] bg-[#7C3AED]/10 shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                                                        : "border-[#2A292F] bg-[#1B1B20]/60 hover:border-[#4A4455] hover:bg-[#1B1B20]"
                                                        }`}
                                                >
                                                    {/* Colour dot or fallback image */}
                                                    {fallbackImgUrl ? (
                                                        <img
                                                            src={fallbackImgUrl}
                                                            alt="Default"
                                                            className="w-5 h-5 rounded-full shrink-0 border-[1.5px] object-cover transition-shadow duration-300"
                                                            style={{
                                                                borderColor: isActive ? "#D2BBFF" : "rgba(74,68,85,0.4)",
                                                                boxShadow: isActive ? `0 0 12px rgba(124,58,237,0.4)` : "none",
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            className="w-5 h-5 rounded-full shrink-0 border-2 transition-shadow duration-300"
                                                            style={{
                                                                backgroundColor: hex,
                                                                borderColor: isActive ? "#D2BBFF" : "rgba(74,68,85,0.4)",
                                                                boxShadow: isActive ? `0 0 12px ${hex}66` : "none",
                                                            }}
                                                        />
                                                    )}
                                                    {/* Colour name */}
                                                    <span className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${isActive ? "text-[#E4E1E9]" : "text-[#958DA1]"}`}>
                                                        {variant.color || "Default"}
                                                    </span>
                                                    {/* Active check */}
                                                    {isActive && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#D2BBFF] ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ── Size Selector (appears after colour pick) ── */}
                                {selectedVariantIndex !== null && activeSizes.length > 0 && (
                                    <div style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
                                        <p className="text-[#958DA1] text-xs uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" /><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" /><path d="M4 12H2" /><path d="M10 12H8" /><path d="M16 12h-2" /><path d="M22 12h-2" /></svg>
                                            Size — <span className="text-[#D2BBFF]">{selectedSize || "Select"}</span>
                                        </p>
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            {activeSizes.map((sizeObj) => {
                                                const variantId = variants[selectedVariantIndex]?._id;
                                                const decrement = (variantId && localStockDecrements[`${variantId}_${sizeObj.size}`]) || 0;
                                                const currentStock = Math.max(0, sizeObj.stock - decrement);
                                                const isActive = selectedSize === sizeObj.size;
                                                const outOfStock = currentStock === 0;
                                                return (
                                                    <button
                                                        key={sizeObj._id}
                                                        onClick={() => !outOfStock && handleSizeSelect(sizeObj.size)}
                                                        disabled={outOfStock}
                                                        className={`relative min-w-[48px] h-11 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300
                                                            ${outOfStock
                                                                ? "border-[#2A292F] bg-[#1B1B20]/30 text-[#4A4455] cursor-not-allowed line-through"
                                                                : isActive
                                                                    ? "border-[#7C3AED] bg-[#7C3AED]/15 text-[#E4E1E9] shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                                                                    : "border-[#2A292F] bg-[#1B1B20]/60 text-[#958DA1] hover:border-[#4A4455] hover:text-[#E4E1E9] hover:bg-[#1B1B20]"
                                                            }`}
                                                    >
                                                        {sizeObj.size}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Stock indicator */}
                                        {selectedSize && selectedStock !== null && (
                                            <div className="mt-3 flex items-center gap-2" style={{ animation: "fadeSlideIn 0.25s ease-out" }}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${selectedStock > 10 ? "bg-emerald-400" : selectedStock > 0 ? "bg-amber-400" : "bg-red-400"}`} />
                                                <span className={`text-[11px] font-medium tracking-wide ${selectedStock > 10 ? "text-emerald-400/80" : selectedStock > 0 ? "text-amber-400/80" : "text-red-400/80"}`}>
                                                    {selectedStock > 10
                                                        ? "In Stock"
                                                        : selectedStock > 0
                                                            ? `Only ${selectedStock} left`
                                                            : "Out of Stock"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── Variant Image Gallery (thumbnails below main image) ──
                                {selectedVariantIndex !== null && activeImages.length > 1 && (
                                    <div style={{ animation: "fadeSlideIn 0.35s ease-out" }}>
                                        <p className="text-[#958DA1] text-xs uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                            {variants[selectedVariantIndex]?.images?.length > 0
                                                ? `${variants[selectedVariantIndex].color || "Variant"} Images`
                                                : "Default Images"}
                                        </p>
                                        <div className="flex gap-3 flex-wrap">
                                            {activeImages.map((img, idx) => (
                                                <button
                                                    key={img._id || idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`w-14 h-16 md:w-[60px] md:h-[75px] rounded-xl overflow-hidden border-[1.5px] transition-all duration-300
                                                        ${currentImageIndex === idx
                                                            ? "border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.3)] scale-105"
                                                            : "border-[#2A292F] opacity-60 hover:opacity-100 hover:border-[#4A4455]"
                                                        }`}
                                                >
                                                    <img src={img.url} alt={`${variants[selectedVariantIndex].color} ${idx + 1}`} className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        )}

                        {/* Price Section */}
                        <div className="bg-[#1B1B20]/40 border border-[#4A4455]/20 backdrop-blur-md rounded-2xl p-6 mb-8">
                            <p className="text-[#958DA1] text-xs uppercase tracking-widest mb-2 font-semibold">Total Price</p>
                            <div className="flex items-end gap-4">
                                <span className="text-4xl font-bold text-white bg-clip-text bg-linear-to-r from-[#E4E1E9] to-[#958DA1]">
                                    {mainPrice}
                                </span>

                                {/* Currency Conversion Badge */}
                                {subPrice && (
                                    <div className="relative group/badge">
                                        {/* Subtle Glow Behind Badge */}
                                        <div className="absolute inset-0 bg-[#7C3AED] blur-lg opacity-20 transition-opacity duration-300 group-hover/badge:opacity-40 rounded-lg"></div>
                                        {/* Badge Content */}
                                        <div className="relative mb-1 px-3 py-1.5 bg-[#2A292F]/80 border border-[#4A4455]/40 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#D2BBFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3-4 4 4 4" /><path d="M12 7h6v5" /><path d="m8 21 4-4-4-4" /><path d="M12 17H6v-5" /></svg>
                                            <span className="text-xs font-semibold text-[#D2BBFF] tracking-wide">
                                                {subPrice}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="flex flex-col gap-4 mt-2">
                            <button
                                onClick={() => handleAddToCart()}
                                disabled={isAddingToCart || (hasVariants && (!selectedSize || selectedStock === 0))}
                                className="w-full h-[52px] rounded-xl font-bold text-sm tracking-widest text-white uppercase bg-linear-to-r from-[#7C3AED] to-[#3B82F6] shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(124,58,237,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center justify-center gap-3 relative"
                            >
                                {isAddingToCart ? (
                                    <>
                                        <SpinnerIcon />
                                        Adding...
                                    </>
                                ) : (
                                    hasVariants && !selectedSize ? "Select a Size" : "Add to Cart"
                                )}
                            </button>
                            <button
                                disabled={hasVariants && (!selectedSize || selectedStock === 0)}
                                className="w-full py-4 rounded-xl font-bold text-sm tracking-widest text-[#0D0D14] uppercase bg-white shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                            >
                                Buy now
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══ Gradient Divider ═══ */}
                <div
                    className="h-px w-full my-16"
                    style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.3) 50%, transparent 100%)",
                    }}
                />

                {/* ─── Other Products Section (Bottom) ─── */}
                {otherProducts.length > 0 && (
                    <div className="mt-8">
                        <div className="mb-10">
                            <h2 className="text-4xl font-bold text-[#E4E1E9] tracking-tight mb-2 flex items-center gap-3">
                                Other Products
                            </h2>
                            <p className="text-[#958DA1] text-xs tracking-wide">Explore more curated fashion pieces.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {otherProducts.map((p, idx) => (
                                <ProductCard key={p._id} product={p} index={idx} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer space */}
            <footer className="pb-12 pt-8">
                <p className="text-[#4A4455] text-[10px] tracking-[0.2em] font-medium uppercase text-center">
                    © 2026 Snitch — Curated Digital Fashion
                </p>
            </footer>
        </div>
    );
};

export default SingleProduct;