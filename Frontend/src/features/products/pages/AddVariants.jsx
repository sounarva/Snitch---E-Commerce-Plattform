import { useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useProducts } from "../hooks/useProducts";
import { useToast } from "../../../shared/Toaster";
import { useNavigate, useParams } from "react-router";

// ─── SVG Icon Components ────────────────────────────────────────────
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

const PaletteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.64 1.5-1.5 0-.35-.15-.65-.3-.85a1.47 1.47 0 0 1-.1-1.65c.31-.5.85-.5 1.4-.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-9.5-10-10z" />
    </svg>
);

// ─── Color Data ─────────────────────────────────────────────────────
const COLORS = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Navy Blue", hex: "#1B2A4A" },
    { name: "Red", hex: "#DC2626" },
    { name: "Grey", hex: "#6B7280" },
    { name: "Olive", hex: "#556B2F" },
    { name: "Maroon", hex: "#800000" },
    { name: "Beige", hex: "#D4B896" },
    { name: "Brown", hex: "#7B4B3A" },
    { name: "Pink", hex: "#EC4899" },
];

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const NUMERIC_SIZES = ["36", "37", "38", "40", "42"];

// ─── Custom Color Dropdown Component ────────────────────────────────
const ColorDropdown = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedColor = COLORS.find((c) => c.name === value);

    const handleSelect = (color) => {
        onChange(color.name);
        setIsOpen(false);
    };

    const handleBlur = (e) => {
        if (!dropdownRef.current?.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef} onBlur={handleBlur}>
            <button
                type="button"
                id="color-dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center w-full gap-3 px-4 py-3 bg-[#1B1B20] rounded-xl text-sm tracking-wide outline-none border transition-all duration-300 cursor-pointer justify-between
                    ${isOpen
                        ? "border-[#7C3AED]/60 shadow-[0_0_20px_rgba(124,58,237,0.15)] bg-[#1F1F25]"
                        : "border-[#4A4455]/20 hover:border-[#4A4455]/40"
                    }`}
            >
                <div className="flex items-center gap-3">
                    {selectedColor ? (
                        <>
                            <span
                                className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                                style={{ backgroundColor: selectedColor.hex }}
                            />
                            <span className="text-[#E4E1E9] font-medium">{selectedColor.name}</span>
                        </>
                    ) : (
                        <span className="text-[#4A4455]">Select a color...</span>
                    )}
                </div>
                <span className={`transition-transform duration-300 text-[#958DA1] ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDownIcon />
                </span>
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute top-full left-0 right-0 mt-2 bg-[#1B1B20] border border-[#4A4455]/30 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50 transition-all duration-300 origin-top max-h-[240px] overflow-y-auto
                    ${isOpen
                        ? "opacity-100 scale-y-100 pointer-events-auto"
                        : "opacity-0 scale-y-95 pointer-events-none"
                    }`}
                style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4455 transparent" }}
            >
                {COLORS.map((color) => (
                    <button
                        type="button"
                        key={color.name}
                        id={`color-option-${color.name.toLowerCase().replace(/\s/g, "-")}`}
                        onClick={() => handleSelect(color)}
                        className={`w-full px-4 py-3 text-left text-sm tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-3
                            ${value === color.name
                                ? "bg-[#7C3AED]/10 text-[#D2BBFF]"
                                : "text-[#E4E1E9] hover:bg-[#4A4455]/15 hover:text-white"
                            }`}
                    >
                        <span
                            className="w-4 h-4 rounded-full shrink-0 border border-white/20 transition-transform duration-200 hover:scale-110"
                            style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// ─── Size Selector Component ────────────────────────────────────────
const SizeSelector = ({ selectedSizes, onSizeToggle }) => {
    const selectedKeys = Object.keys(selectedSizes);
    let activeType = null;
    if (selectedKeys.length > 0) {
        if (CLOTHING_SIZES.includes(selectedKeys[0])) activeType = "clothing";
        else if (NUMERIC_SIZES.includes(selectedKeys[0])) activeType = "numeric";
    }

    return (
        <div className="space-y-4">
            {/* Clothing Sizes */}
            <div>
                <p className="text-[#958DA1] text-[10px] uppercase tracking-[0.15em] mb-2.5 ml-1 font-medium">Clothing Sizes</p>
                <div className="flex flex-wrap gap-2.5">
                    {CLOTHING_SIZES.map((size) => {
                        const isSelected = selectedSizes.hasOwnProperty(size);
                        const isDisabled = activeType === "numeric";
                        return (
                            <button
                                type="button"
                                key={size}
                                id={`size-${size.toLowerCase()}`}
                                onClick={() => !isDisabled && onSizeToggle(size)}
                                disabled={isDisabled}
                                className={`px-5 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 border
                                    ${isSelected
                                        ? "bg-linear-to-r from-[#7C3AED] to-[#3B82F6] text-white border-transparent shadow-[0_0_20px_rgba(124,58,237,0.3)] scale-105"
                                        : isDisabled
                                            ? "bg-transparent border-[#4A4455]/10 text-[#4A4455] cursor-not-allowed opacity-50"
                                            : "bg-transparent border-[#4A4455]/30 text-[#958DA1] cursor-pointer hover:border-[#7C3AED]/40 hover:text-[#D2BBFF] hover:bg-[#7C3AED]/5 hover:shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                                    }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Numeric Sizes */}
            <div>
                <p className="text-[#958DA1] text-[10px] uppercase tracking-[0.15em] mb-2.5 ml-1 font-medium">Numeric Sizes</p>
                <div className="flex flex-wrap gap-2.5">
                    {NUMERIC_SIZES.map((size) => {
                        const isSelected = selectedSizes.hasOwnProperty(size);
                        const isDisabled = activeType === "clothing";
                        return (
                            <button
                                type="button"
                                key={size}
                                id={`size-${size}`}
                                onClick={() => !isDisabled && onSizeToggle(size)}
                                disabled={isDisabled}
                                className={`px-5 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 border
                                    ${isSelected
                                        ? "bg-linear-to-r from-[#7C3AED] to-[#3B82F6] text-white border-transparent shadow-[0_0_20px_rgba(124,58,237,0.3)] scale-105"
                                        : isDisabled
                                            ? "bg-transparent border-[#4A4455]/10 text-[#4A4455] cursor-not-allowed opacity-50"
                                            : "bg-transparent border-[#4A4455]/30 text-[#958DA1] cursor-pointer hover:border-[#7C3AED]/40 hover:text-[#D2BBFF] hover:bg-[#7C3AED]/5 hover:shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                                    }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── Main AddVariants Component ─────────────────────────────────────
const AddVariants = () => {
    const { id: productId } = useParams();
    const { addVariant } = useProducts();
    const { loading } = useSelector((state) => state.product);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [color, setColor] = useState("");
    const [sizeStocks, setSizeStocks] = useState({}); // { "M": "10", "L": "5", ... }
    const [images, setImages] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [imageWarning, setImageWarning] = useState("");

    const MAX_IMAGES = 5;
    const selectedSizeKeys = Object.keys(sizeStocks);

    // Validation: at least 1 size, every selected size has stock > 0
    const isFormValid =
        selectedSizeKeys.length > 0 &&
        selectedSizeKeys.every((s) => sizeStocks[s] && Number(sizeStocks[s]) > 0);

    // ─── Image handling ──────────────────────────────────────────
    const processFiles = useCallback((files) => {
        const validFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/")
        );

        if (validFiles.length === 0) return;

        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) {
            setImageWarning("Maximum 5 images allowed");
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

    // ─── Size handling ───────────────────────────────────────────
    const handleSizeToggle = (size) => {
        setSizeStocks((prev) => {
            const next = { ...prev };
            if (next.hasOwnProperty(size)) {
                delete next[size];
            } else {
                next[size] = "";
            }
            return next;
        });
    };

    const handleStockChange = (size, value) => {
        setSizeStocks((prev) => ({ ...prev, [size]: value }));
    };

    // ─── Form submission ─────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) return;

        const sizesArray = selectedSizeKeys.map((s) => ({
            size: s,
            stock: Number(sizeStocks[s]),
        }));

        const formData = new FormData();
        if (color) {
            formData.append("color", color);
        }
        formData.append("sizes", JSON.stringify(sizesArray));
        images.forEach((img) => {
            formData.append("images", img.file);
        });

        const result = await addVariant(productId, formData);

        if (result) {
            showToast("Variant added successfully!", true);
            setColor("");
            setSizeStocks({});
            setImages([]);
        } else {
            showToast("Failed to add variant", false);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#0A0A0F] font-[Poppins] relative overflow-hidden flex items-center justify-center p-6 lg:p-8 ">
            {/* ═══ Go Back Button ═══ */}
            <button
                onClick={() => navigate("/seller/show-product")}
                className="absolute top-6 left-4 lg:top-8 lg:left-4 z-50 flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-[#958DA1] transition-all duration-300 hover:text-[#D2BBFF] cursor-pointer bg-transparent border-none outline-none group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                Back to products
            </button>

            {/* ═══ Animated Background Gradients ═══ */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#7C3AED]/8 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute top-[40%] right-[5%] w-[350px] h-[350px] rounded-full bg-[#3B82F6]/6 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute bottom-[10%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#A78BFA]/5 blur-[100px] animate-[float_12s_ease-in-out_infinite]" />
            </div>

            {/* ═══ Main Content Card ═══ */}
            <form
                onSubmit={handleSubmit}
                id="add-variant-form"
                className="relative z-10 w-full max-w-[1150px] h-full max-h-[780px] flex flex-col lg:flex-row gap-6 lg:gap-10 bg-[#0D0D14]/80 border border-[#4A4455]/15 rounded-3xl p-6 lg:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
                {/* ═══ Left Column: Header, Color & Sizes ═══ */}
                <div className="flex-1 flex flex-col h-full justify-between pr-2 lg:pr-4">
                    {/* Header Section */}
                    <div>
                        {/* Brand pill */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                            <span className="text-[#D2BBFF] text-[10px] uppercase tracking-[0.15em] font-medium">Seller Dashboard</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl lg:text-[2.25rem] font-bold text-[#E4E1E9] tracking-tight leading-tight mb-2" id="add-variant-title">
                            Add Product Variant
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[#958DA1] text-sm tracking-wide max-w-sm">
                            Configure variant details for your product.
                        </p>

                        {/* Product ID Badge */}
                        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/25 shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                            <span className="text-[#958DA1] text-[10px] uppercase tracking-[0.12em] font-medium">Product ID</span>
                            <span className="text-[#D2BBFF] text-xs font-semibold tracking-wide font-mono">
                                {productId ? `${productId}` : "N/A"}
                            </span>
                        </div>

                        {/* Gradient underline */}
                        <div className="mt-5 w-16 h-[2px] bg-linear-to-r from-[#7C3AED] via-[#A78BFA] to-transparent" />
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-8 mt-6 flex-1 overflow-y-auto min-h-0 pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4455 transparent" }}>
                        {/* ─── Color Selection ─── */}
                        <div>
                            <label className="flex items-center gap-2 text-[#958DA1] text-xs uppercase tracking-[0.15em] mb-2 font-semibold ml-1">
                                <PaletteIcon />
                                Color <span className="text-[10px] text-[#4A4455] opacity-80 normal-case tracking-normal ml-1">(Optional)</span>
                            </label>
                            <ColorDropdown value={color} onChange={setColor} />
                        </div>

                        {/* ─── Size Selection ─── */}
                        <div>
                            <label className="block text-[#958DA1] text-xs uppercase tracking-[0.15em] mb-3 font-semibold ml-1">
                                Select Sizes
                            </label>
                            <SizeSelector
                                selectedSizes={sizeStocks}
                                onSizeToggle={handleSizeToggle}
                            />
                        </div>

                        {/* ─── Per-Size Stock Inputs ─── */}
                        {selectedSizeKeys.length > 0 && (
                            <div>
                                <label className="block text-[#958DA1] text-xs uppercase tracking-[0.15em] mb-3 font-semibold ml-1">
                                    Stock Per Size
                                </label>
                                <div className="flex flex-col gap-2.5 max-h-[180px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4455 transparent" }}>
                                    {selectedSizeKeys.map((size, index) => (
                                        <div
                                            key={size}
                                            className="flex items-center gap-3"
                                            style={{ animation: `fadeSlideIn 0.3s ease-out ${index * 0.05}s both` }}
                                        >
                                            {/* Size badge */}
                                            <span className="w-14 shrink-0 text-center px-3 py-2.5 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/25 text-[#D2BBFF] text-xs font-bold tracking-wide">
                                                {size}
                                            </span>

                                            {/* Stock input */}
                                            <div className="group relative flex-1">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                                        <line x1="12" y1="22.08" x2="12" y2="12" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id={`stock-${size}`}
                                                    type="number"
                                                    placeholder="Stock qty..."
                                                    value={sizeStocks[size]}
                                                    onChange={(e) => handleStockChange(size, e.target.value)}
                                                    min="1"
                                                    className="w-full pl-9 pr-3 py-2.5 bg-[#1B1B20] rounded-lg text-[#E4E1E9] placeholder-[#4A4455] text-sm tracking-wide outline-none border border-[#4A4455]/20 transition-all duration-300 focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:bg-[#1F1F25] hover:border-[#4A4455]/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                                Variant Images <span className="text-[10px] text-[#4A4455] opacity-80 normal-case tracking-normal ml-1">(Optional)</span>
                            </label>
                            {images.length > 0 && (
                                <span className="text-[10px] text-[#958DA1] tracking-wider font-medium">
                                    {images.length}/{MAX_IMAGES}
                                </span>
                            )}
                        </div>

                        {/* Drag & Drop Zone */}
                        <div
                            id="variant-image-drop-zone"
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
                                id="variant-image-file-input"
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
                                                id={`remove-variant-image-${index}`}
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

                                    {/* Add More Card */}
                                    {images.length < MAX_IMAGES && (
                                        <button
                                            type="button"
                                            id="add-more-variant-images"
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
                            id="add-variant-submit"
                            disabled={loading || !isFormValid}
                            className="w-full py-3.5 lg:py-4 rounded-xl font-bold text-sm uppercase tracking-[0.15em] text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer flex items-center justify-center gap-2.5 relative overflow-hidden group/btn"
                        >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700 ease-in-out" />

                            {loading ? (
                                <>
                                    <SpinnerIcon />
                                    Adding Variant...
                                </>
                            ) : (
                                <>
                                    <RocketIcon />
                                    Add Variant
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

export default AddVariants;