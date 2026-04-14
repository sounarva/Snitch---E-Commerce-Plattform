import { useState, useRef, useCallback } from "react";
import { useProducts } from "../hooks/useProducts";
import { useSelector } from "react-redux";
import { useToast } from "../../../shared/Toaster";
import { useNavigate } from "react-router";

// ─── SVG Icon Components ────────────────────────────────────────────
const TagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
);

const TextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" />
    </svg>
);

const CurrencyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

const RocketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
);

// ─── Custom Dropdown Component ──────────────────────────────────────
const CurrencyDropdown = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const currencies = ["INR", "USD"];

    const handleSelect = (currency) => {
        onChange(currency);
        setIsOpen(false);
    };

    // Close on outside click
    const handleBlur = (e) => {
        if (!dropdownRef.current?.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative h-full" ref={dropdownRef} onBlur={handleBlur}>
            <button
                type="button"
                id="currency-dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center h-full gap-2 px-5 py-3 bg-[#1B1B20] rounded-xl text-[#E4E1E9] text-sm tracking-wide outline-none border transition-all duration-300 cursor-pointer min-w-[100px] justify-between
                    ${isOpen
                        ? "border-[#7C3AED]/60 shadow-[0_0_20px_rgba(124,58,237,0.15)] bg-[#1F1F25]"
                        : "border-[#4A4455]/20 hover:border-[#4A4455]/40"
                    }`}
            >
                <span className="font-medium">{value}</span>
                <span className={`transition-transform duration-300 text-[#958DA1] ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDownIcon />
                </span>
            </button>

            {/* Dropdown Menu - Drops UP to prevent clipping at the bottom of the tall form */}
            <div
                className={`absolute top-full left-0 right-0 mt-2 bg-[#1B1B20] border border-[#4A4455]/30 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50 transition-all duration-300 origin-top
                    ${isOpen
                        ? "opacity-100 scale-y-100 pointer-events-auto"
                        : "opacity-0 scale-y-95 pointer-events-none"
                    }`}
            >
                {currencies.map((currency) => (
                    <button
                        type="button"
                        key={currency}
                        id={`currency-option-${currency.toLowerCase()}`}
                        onClick={() => handleSelect(currency)}
                        className={`w-full px-5 py-3 text-left text-sm tracking-wide transition-all duration-200 cursor-pointer
                            ${value === currency
                                ? "bg-[#7C3AED]/10 text-[#D2BBFF]"
                                : "text-[#E4E1E9] hover:bg-[#4A4455]/15 hover:text-white"
                            }`}
                    >
                        {currency}
                    </button>
                ))}
            </div>
        </div>
    );
};


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
        amount: "",
        currency: "INR",
    });
    const [images, setImages] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [imageWarning, setImageWarning] = useState("");

    const MAX_IMAGES = 7;

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
        productData.append("description", formData.description);
        productData.append("priceAmt", formData.amount);
        productData.append("priceCurrency", formData.currency);
        images.forEach((img) => {
            productData.append("images", img.file);
        });

        const result = await createProduct(productData);

        if (result) {
            showToast("Product created successfully!", true);
            setFormData({
                title: "",
                description: "",
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
                    <div className="flex flex-col gap-10 mt-6 flex-1 justify-center">
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
                            className={`relative flex flex-col items-center justify-center gap-3 py-8 px-6 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group shrink-0
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
                        <div className="flex-1 mt-4 overflow-y-auto scrollbar-thin pr-2 min-h-0" style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4455 transparent" }}>
                            {images.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3 pb-3">
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