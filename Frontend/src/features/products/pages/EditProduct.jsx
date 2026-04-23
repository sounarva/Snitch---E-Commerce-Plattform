import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProducts } from "../hooks/useProducts";
import { CATEGORIES } from "../../../data/data";
import TagIcon from "../../../svg/TagIcon";
import TextIcon from "../../../svg/TextIcon";
import CurrencyIcon from "../../../svg/CurrencyIcon";
import SpinnerIcon from "../../../svg/SpinnerIcon";
import EmptyBoxIcon from "../../../svg/EmptyBoxIcon";
import RocketIcon from "../../../svg/RocketIcon";
import CategoryDropdown from "../components/CategoryDropdown";
import CurrencyDropdown from "../components/CurrencyDropdown";
import { useToast } from "../../../shared/Toaster";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchSellerProducts, editProductDetails } = useProducts();
    const { sellerProducts, loading } = useSelector((state) => state.product);
    const { showToast } = useToast()

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        priceAmt: "",
        priceCurrency: "INR",
    });

    const [productFound, setProductFound] = useState(true);

    useEffect(() => {
        if (sellerProducts.length === 0) {
            fetchSellerProducts();
        }
    }, []);

    useEffect(() => {
        if (!loading && sellerProducts.length > 0) {
            const product = sellerProducts.find((item) => item._id === id);
            if (product) {
                setFormData({
                    title: product.title || "",
                    description: product.description || "",
                    category: product.category || "",
                    priceAmt: product.price?.amount || "",
                    priceCurrency: product.price?.currency || "INR",
                });
                setProductFound(true);
            } else {
                setProductFound(false);
            }
        }
    }, [id, sellerProducts, loading]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCurrencyChange = (priceCurrency) => {
        setFormData({ ...formData, priceCurrency });
    };

    const handleUpdate = async () => {
        const response = await editProductDetails(id, formData)
        if (response.success) {
            showToast(response.message, true)
        } else {
            showToast(response.message, false)
        }
    }

    if (loading && sellerProducts.length === 0) {
        return (
            <div className="h-screen w-screen bg-[#0A0A0F] flex flex-col items-center justify-center text-[#7C3AED]">
                <SpinnerIcon />
                <p className="text-[#958DA1] text-sm mt-4 tracking-widest uppercase animate-pulse">Loading Product Data...</p>
            </div>
        );
    }

    if (!productFound) {
        return (
            <div className="h-screen w-screen bg-[#0A0A0F] flex flex-col items-center justify-center p-8 text-center">
                <div className="text-[#4A4455] mb-6 animate-bounce">
                    <EmptyBoxIcon />
                </div>
                <h3 className="text-2xl font-bold text-[#E4E1E9] mb-2">Product Not Found</h3>
                <p className="text-[#958DA1] max-w-sm mb-8 text-sm">
                    We couldn't find the product you're looking for.
                </p>
                <button
                    onClick={() => navigate("/seller/show-product")}
                    className="px-6 py-3 rounded-xl border border-[#7C3AED]/50 bg-[#7C3AED]/10 text-[#D2BBFF] font-semibold text-sm hover:bg-[#7C3AED]/20 transition-all duration-300 cursor-pointer"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#0A0A0F] font-[Poppins] relative overflow-hidden flex items-center justify-center p-6 lg:p-8">
            {/* ═══ Go Back Button ═══ */}
            <button
                onClick={() => navigate("/seller/show-product")}
                className="absolute top-6 left-4 lg:top-8 lg:left-4 z-50 flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-[#958DA1] transition-all duration-300 hover:text-[#D2BBFF] cursor-pointer bg-transparent border-none outline-none group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Products
            </button>

            {/* ═══ Animated Background Gradients ═══ */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#7C3AED]/8 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute top-[40%] right-[5%] w-[350px] h-[350px] rounded-full bg-[#3B82F6]/6 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute bottom-[10%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#A78BFA]/5 blur-[100px] animate-[float_12s_ease-in-out_infinite]" />
            </div>

            {/* ═══ Main Content: Single Column Focused Layout ═══ */}
            <div
                className="relative z-10 w-full max-w-[650px] bg-[#0D0D14]/80 border border-[#4A4455]/15 rounded-3xl p-8 lg:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500"
            >
                {/* Header Section */}
                <div className="mb-8">
                    {/* Brand pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                        <span className="text-[#D2BBFF] text-[10px] uppercase tracking-[0.15em] font-medium">Seller Dashboard</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl lg:text-[2.25rem] font-bold text-[#E4E1E9] tracking-tight leading-tight mb-2">
                        Edit Product
                    </h1>

                    {/* Subtitle */}
                    <p className="text-[#958DA1] text-sm tracking-wide">
                        Refine your product details with premium precision.
                    </p>

                    {/* Gradient underline */}
                    <div className="mt-4 w-16 h-[2px] bg-linear-to-r from-[#7C3AED] via-[#A78BFA] to-transparent" />
                </div>

                {/* ═══ Form Content ═══ */}
                <div className="flex flex-col gap-5">
                    {/* ─── Product Title ─── */}
                    <div>
                        <label className="block text-[#958DA1] text-[10px] uppercase tracking-[0.2em] mb-2 font-bold ml-1">
                            Product Title
                        </label>
                        <div className="group relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                <TagIcon />
                            </div>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter product title..."
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-[#1B1B20] rounded-xl text-[#E4E1E9] placeholder-[#4A4455] text-sm tracking-wide outline-none border border-[#4A4455]/20 transition-all duration-300 focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:bg-[#1F1F25] hover:border-[#4A4455]/40"
                            />
                        </div>
                    </div>

                    {/* ─── Product Category & Price Row ─── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Category */}
                        <div>
                            <label className="block text-[#958DA1] text-[10px] uppercase tracking-[0.2em] mb-2 font-bold ml-1">
                                Category
                            </label>
                            <CategoryDropdown
                                value={formData.category}
                                onChange={(val) => setFormData({ ...formData, category: val })}
                                options={CATEGORIES}
                                direction="top"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-[#958DA1] text-[10px] uppercase tracking-[0.2em] mb-2 font-bold ml-1">
                                Price
                            </label>
                            <div className="flex gap-3 items-stretch">
                                <div className="group relative flex-1">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                        <CurrencyIcon />
                                    </div>
                                    <input
                                        type="number"
                                        name="priceAmt"
                                        placeholder="0.00"
                                        value={formData.priceAmt}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-[#1B1B20] rounded-xl text-[#E4E1E9] placeholder-[#4A4455] text-sm tracking-wide outline-none border border-[#4A4455]/20 transition-all duration-300 focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:bg-[#1F1F25] hover:border-[#4A4455]/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                                <CurrencyDropdown
                                    value={formData.priceCurrency}
                                    onChange={handleCurrencyChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ─── Product Description ─── */}
                    <div>
                        <label className="block text-[#958DA1] text-[10px] uppercase tracking-[0.2em] mb-2 font-bold ml-1">
                            Description
                        </label>
                        <div className="group relative">
                            <div className="absolute left-4 top-3.5 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                <TextIcon />
                            </div>
                            <textarea
                                name="description"
                                placeholder="Describe your product in detail..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full pl-12 pr-4 py-3 bg-[#1B1B20] rounded-xl text-[#E4E1E9] placeholder-[#4A4455] text-sm tracking-wide outline-none border border-[#4A4455]/20 transition-all duration-300 focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:bg-[#1F1F25] hover:border-[#4A4455]/40 resize-none scrollbar-thin"
                                style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4455 transparent" }}
                            />
                        </div>
                    </div>

                    {/* ─── Action Buttons ─── */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <button
                            onClick={handleUpdate}
                            type="button"
                            disabled={loading}
                            className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-[0.15em] text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 relative overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                            {loading ? (
                                <>
                                    <SpinnerIcon />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <RocketIcon />
                                    Update Product
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/seller/show-product")}
                            className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.15em] text-[#958DA1] bg-transparent border border-[#4A4455]/40 hover:bg-[#4A4455]/10 hover:border-[#4A4455]/60 hover:text-[#E4E1E9] transition-all duration-300 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Footer Branding */}
                    <div className="mt-4 text-center">
                        <p className="text-[#4A4455] text-[9px] tracking-[0.3em] font-medium uppercase">
                            © 2026 Snitch — Obsidian Noir System
                        </p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
            `}} />
        </div>
    );
};

export default EditProduct;

