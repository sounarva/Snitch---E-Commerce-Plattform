import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProducts } from "../hooks/useProducts";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchSingleProduct, fetchAllProducts } = useProducts();
    const { singleProduct, allProducts, loading } = useSelector((state) => state.product);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fetch product details
    useEffect(() => {
        if (id) {
            const product = async () => {
                const res = await fetchSingleProduct(id);
                if (res.success) {
                    setCurrentImageIndex(0); // Reset image index when navigating to new product
                    window.scrollTo(0, 0); // Scroll to top when changing product
                }
            }
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
    const images = product?.images || [];
    const hasMultipleImages = images.length > 1;

    // Image navigation
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    // Pricing & Conversion
    const getFormattedPrices = (priceObj) => {
        if (!priceObj) return { main: "N/A", sub: "" };
        const { amount, currency } = priceObj;
        if (currency === "INR") {
            const usdAppx = (amount / 83).toFixed(2);
            return {
                main: `₹${Number(amount).toLocaleString("en-IN")}`,
                sub: `$${usdAppx} (approx)`
            };
        } else if (currency === "USD") {
            const inrAppx = (amount * 83).toFixed(2);
            return {
                main: `$${Number(amount).toLocaleString("en-US")}`,
                sub: `₹${Number(inrAppx).toLocaleString("en-IN")} (approx)`
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">

                    {/* LEFT SIDE: Image Gallery */}
                    <div className="flex flex-col gap-4">
                        {/* Main Image Container */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1B1B20] border border-[#2A292F] shadow-[0_20px_60px_rgba(0,0,0,0.5)] group">
                            {images.length > 0 ? (
                                <img
                                    src={images[currentImageIndex]?.url}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1B1B20]/60 backdrop-blur-md border border-[#4A4455]/50 flex items-center justify-center text-[#E4E1E9] transition-all hover:bg-[#7C3AED]/80 hover:scale-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] opacity-0 group-hover:opacity-100 z-10"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 -ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1B1B20]/60 backdrop-blur-md border border-[#4A4455]/50 flex items-center justify-center text-[#E4E1E9] transition-all hover:bg-[#7C3AED]/80 hover:scale-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] opacity-0 group-hover:opacity-100 z-10"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 -mr-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {hasMultipleImages && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === idx
                                                ? "border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                                                : "border-transparent opacity-50 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: Product Details */}
                    <div className="flex flex-col justify-start pt-4 lg:pt-10">
                        {/* Badges */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[#D2BBFF] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                                Premium Edition
                            </span>
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
                            <button className="w-full py-4 rounded-xl font-bold text-sm tracking-widest text-white uppercase bg-linear-to-r from-[#7C3AED] to-[#3B82F6] shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_35px_rgba(124,58,237,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
                                Add to Cart
                            </button>
                            <button className="w-full py-4 rounded-xl font-bold text-sm tracking-widest text-[#0D0D14] uppercase bg-white shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
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