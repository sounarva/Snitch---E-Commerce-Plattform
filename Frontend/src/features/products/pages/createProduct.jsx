import { useState, useRef, useCallback } from "react";
import { useProducts } from "../hooks/useProducts";
import { useSelector } from "react-redux";
import { useToast } from "../../../shared/Toaster";
import { useNavigate } from "react-router";
import TagIcon from "../../../svg/TagIcon";
import TextIcon from "../../../svg/TextIcon";
import CurrencyIcon from "../../../svg/CurrencyIcon";
import UploadIcon from "../../../svg/UploadIcon";
import ImageIcon from "../../../svg/ImageIcon";
import CloseIcon from "../../../svg/CloseIcon";
import SpinnerIcon from "../../../svg/SpinnerIcon";
import RocketIcon from "../../../svg/RocketIcon";
import CurrencyDropdown from "../components/CurrencyDropdown";
import CategoryDropdown from "../components/CategoryDropdown";
import { CATEGORIES } from "../../../data/data";

// ─── Main CreateProduct Component ───────────────────────────────────
const CreateProduct = () => {
    const { createProduct } = useProducts();
    const { loading } = useSelector((state) => state.product);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        amount: "",
        currency: "INR",
    });
    const [images, setImages] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [imageWarning, setImageWarning] = useState("");

    const MAX_IMAGES = 6;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCurrencyChange = (currency) => {
        setFormData({ ...formData, currency });
    };

    // ─── Image handling ──────────────────────────────────────────
    const processFiles = useCallback((files) => {
        const validFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/")
        );

        if (validFiles.length === 0) return;

        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) {
            setImageWarning("Maximum 7 images allowed");
            setTimeout(() => setImageWarning(""), 3000);
            return;
        }

        const filesToAdd = validFiles.slice(0, remaining);
        if (validFiles.length > remaining) {
            setImageWarning(`Only ${remaining} more image${remaining > 1 ? "s" : ""} can be added`);
            setTimeout(() => setImageWarning(""), 3000);
        }

        const newImages = filesToAdd.map((file) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...newImages]);
    }, [images.length]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleFileSelect = (e) => {
        processFiles(e.target.files);
        e.target.value = "";
    };

    const removeImage = (id) => {
        setImages((prev) => {
            const img = prev.find((i) => i.id === id);
            if (img) URL.revokeObjectURL(img.preview);
            return prev.filter((i) => i.id !== id);
        });
        setImageWarning("");
    };

    // ─── Form submission ─────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            showToast("Please add at least one product image", false);
            return;
        }

        const productData = new FormData();
        productData.append("title", formData.title);
        productData.append("category", formData.category);
        productData.append("description", formData.description);
        productData.append("priceAmt", formData.amount);
        productData.append("priceCurrency", formData.currency);
        images.forEach((img) => {
            productData.append("images", img.file);
        });

        const result = await createProduct(productData);

        if (result) {
            showToast("Product created successfully", true);
            setFormData({
                title: "",
                description: "",
                category: "",
                amount: "",
                currency: "INR",
            });
            setImages([]);
        } else {
            showToast("Failed to create product", false);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#0A0A0F] font-[Poppins] relative overflow-hidden flex items-center justify-center p-6 lg:p-8">
            {/* ═══ Go Back Button ═══ */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-4 lg:top-8 lg:left-4 z-50 flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-[#958DA1] transition-all duration-300 hover:text-[#D2BBFF] cursor-pointer bg-transparent border-none outline-none group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Back to home
            </button>

            {/* ═══ Animated Background Gradients ═══ */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#7C3AED]/8 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute top-[40%] right-[5%] w-[350px] h-[350px] rounded-full bg-[#3B82F6]/6 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute bottom-[10%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#A78BFA]/5 blur-[100px] animate-[float_12s_ease-in-out_infinite]" />
            </div>

            {/* ═══ Main Content: Side-by-Side Flex Layout (Proportionally Scaled) ═══ */}
            <form
                onSubmit={handleSubmit}
                id="create-product-form"
                className="relative z-10 w-full max-w-[1150px] h-full max-h-[720px] flex flex-col lg:flex-row gap-6 lg:gap-10 bg-[#0D0D14]/80 border border-[#4A4455]/15 rounded-3xl p-6 lg:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
                {/* ═══ Left Column: Header & Text Inputs ═══ */}
                <div className="flex-1 flex flex-col h-full justify-between pr-2 lg:pr-4">

                    {/* Header Section */}
                    <div>
                        {/* Brand pill */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                            <span className="text-[#D2BBFF] text-[10px] uppercase tracking-[0.15em] font-medium">Seller Dashboard</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl lg:text-[2.25rem] font-bold text-[#E4E1E9] tracking-tight leading-tight mb-2" id="create-product-title">
                            Create Product
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[#958DA1] text-sm tracking-wide max-w-sm">
                            Add your product details to list it on Snitch.
                        </p>

                        {/* Gradient underline */}
                        <div className="mt-4 w-16 h-[2px] bg-linear-to-r from-[#7C3AED] via-[#A78BFA] to-transparent" />
                    </div>

                    {/* Inputs Section */}
                    <div className="flex flex-col gap-6 mt-6 flex-1 justify-center">
                        {/* ─── Product Title ─── */}
                        <div>
                            <label htmlFor="product-title" className="block text-[#958DA1] text-xs uppercase tracking-[0.15em] mb-2 font-semibold ml-1">
                                Product Title
                            </label>
                            <div className="group relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                    <TagIcon />
                                </div>
                                <input
                                    id="product-title"
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

                        {/* ─── Product Category ─── */}
                        <div>
                            <label htmlFor="product-category" className="block text-[#958DA1] text-xs uppercase tracking-[0.15em] mb-2 font-semibold ml-1">
                                Category
                            </label>
                            <CategoryDropdown
                                value={formData.category}
                                onChange={(val) => setFormData({ ...formData, category: val })}
                                options={CATEGORIES}
                            />
                        </div>

                        {/* ─── Product Description ─── */}
                        <div>
                            <label htmlFor="product-description" className="block text-[#958DA1] text-xs uppercase tracking-[0.15em] mb-2 font-semibold ml-1">
                                Description
                            </label>
                            <div className="group relative">
                                <div className="absolute left-4 top-3.5 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                    <TextIcon />
                                </div>
                                <textarea
                                    id="product-description"
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

                        {/* ─── Price Section (Grouped) ─── */}
                        <div>
                            <label className="block text-[#958DA1] text-xs uppercase tracking-[0.15em] mb-2 font-semibold ml-1">
                                Price
                            </label>
                            <div className="flex gap-3 items-stretch">
                                {/* Amount Input */}
                                <div className="group relative flex-1">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                        <CurrencyIcon />
                                    </div>
                                    <input
                                        id="product-price"
                                        type="number"
                                        name="amount"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-12 pr-4 py-3 bg-[#1B1B20] rounded-xl text-[#E4E1E9] placeholder-[#4A4455] text-sm tracking-wide outline-none border border-[#4A4455]/20 transition-all duration-300 focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:bg-[#1F1F25] hover:border-[#4A4455]/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>

                                {/* Currency Dropdown */}
                                <CurrencyDropdown
                                    value={formData.currency}
                                    onChange={handleCurrencyChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Vertical Divider ═══ */}
                <div className="hidden lg:block w-px bg-linear-to-b from-transparent via-[#4A4455]/40 to-transparent my-2" />

                {/* ═══ Right Column: Images & Submit ═══ */}
                <div className="flex-1 flex flex-col h-full justify-between pl-2 lg:pl-4">

                    {/* ─── Image Upload Section ─── */}
                    <div className="flex-1 flex flex-col pt-1">
                        <div className="flex items-center justify-between mb-3 mt-1">
                            <label className="block text-[#958DA1] text-xs uppercase tracking-[0.15em] font-semibold ml-1">
                                Product Gallery
                            </label>
                        </div>

                        {/* Drag & Drop Zone */}
                        <div
                            id="image-drop-zone"
                            onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group shrink-0
                                ${isDragOver
                                    ? "border-[#7C3AED]/60 bg-[#7C3AED]/5 shadow-[0_0_30px_rgba(124,58,237,0.15)]"
                                    : images.length >= MAX_IMAGES
                                        ? "border-[#4A4455]/10 bg-[#1B1B20]/30 cursor-not-allowed opacity-50"
                                        : "border-[#4A4455]/20 bg-[#1B1B20]/50 hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/3 hover:shadow-[0_0_25px_rgba(124,58,237,0.08)]"
                                }`}
                        >
                            <div className={`transition-all duration-300 ${isDragOver ? "text-[#D2BBFF] scale-110" : "text-[#958DA1] group-hover:text-[#D2BBFF] group-hover:scale-110"}`}>
                                <UploadIcon />
                            </div>
                            <div className="text-center">
                                <p className={`text-sm font-medium tracking-wide transition-colors duration-300 ${isDragOver ? "text-[#D2BBFF]" : "text-[#E4E1E9]"}`}>
                                    {images.length >= MAX_IMAGES
                                        ? "Maximum images reached"
                                        : "Drag & drop your images here"
                                    }
                                </p>
                                <p className="text-[11px] text-[#958DA1] mt-1 tracking-wider">
                                    or click to browse {images.length > 0 ? `(${MAX_IMAGES - images.length} remaining)` : `(Max ${MAX_IMAGES})`}
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                id="image-file-input"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Image Warning */}
                        {imageWarning && (
                            <p className="mt-3 text-xs text-amber-400/80 tracking-wide flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                                    <path d="M12 9v4" /><path d="M12 17h.01" />
                                </svg>
                                {imageWarning}
                            </p>
                        )}

                        {/* ─── Image Preview Grid ─── */}
                        <div className="flex-1 mt-3 overflow-y-auto scrollbar-thin pr-1 min-h-0" style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4455 transparent" }}>
                            {images.length > 0 ? (
                                <div className="grid grid-cols-5 gap-2 pb-3">
                                    {images.map((img, index) => (
                                        <div
                                            key={img.id}
                                            className="relative group/img aspect-square rounded-xl overflow-hidden border border-[#4A4455]/15 bg-[#1B1B20] transition-all duration-300 hover:border-[#7C3AED]/40 hover:shadow-[0_4px_25px_rgba(124,58,237,0.2)] hover:scale-[1.03]"
                                            style={{
                                                animation: `fadeSlideIn 0.4s ease-out ${index * 0.05}s both`,
                                            }}
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                            />

                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-all duration-300" />

                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                id={`remove-image-${index}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(img.id);
                                                }}
                                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-[#0A0A0F]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-red-500/20 hover:border-red-400/30 transition-all duration-300 opacity-0 group-hover/img:opacity-100 scale-90 group-hover/img:scale-100 cursor-pointer"
                                                aria-label={`Remove image ${index + 1}`}
                                            >
                                                <CloseIcon />
                                            </button>

                                            {/* Image number badge */}
                                            <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#0A0A0F]/80 backdrop-blur-md border border-white/10">
                                                <span className="text-[9px] text-white/70 font-semibold">{index + 1}</span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add More Card (if under limit) */}
                                    {images.length < MAX_IMAGES && (
                                        <button
                                            type="button"
                                            id="add-more-images"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-xl border-2 border-dashed border-[#4A4455]/20 bg-[#1B1B20]/30 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/10 hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] cursor-pointer group/add"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#4A4455] group-hover/add:text-[#D2BBFF] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 5v14" /><path d="M5 12h14" />
                                            </svg>
                                            <span className="text-[10px] text-[#4A4455] group-hover/add:text-[#958DA1] transition-colors duration-300 uppercase tracking-widest font-semibold">Add</span>
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center border-2 border-dashed border-transparent">
                                    <p className="text-[#4A4455] text-xs text-center flex flex-col items-center gap-2">
                                        <ImageIcon />
                                        <span>Uploaded images will appear here</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ─── Submit Button & Footer ─── */}
                    <div className="mt-6 mb-1">
                        <button
                            type="submit"
                            id="create-product-submit"
                            disabled={loading}
                            className="w-full py-3.5 lg:py-4 rounded-xl font-bold text-sm uppercase tracking-[0.15em] text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer flex items-center justify-center gap-2.5 relative overflow-hidden group/btn"
                        >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700 ease-in-out" />

                            {loading ? (
                                <>
                                    <SpinnerIcon />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <RocketIcon />
                                    Create Product
                                </>
                            )}
                        </button>

                        <div className="mt-5 text-center">
                            <p className="text-[#4A4455] text-[10px] tracking-widest font-medium uppercase">
                                © 2026 Snitch — Curated Digital Fashion
                            </p>
                        </div>
                    </div>

                </div>
            </form>

        </div>
    );
};

export default CreateProduct;