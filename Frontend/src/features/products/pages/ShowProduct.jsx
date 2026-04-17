import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router";

// ─── Icons ──────────────────────────────────────────────────────────
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const ZoomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const EmptyBoxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="w-8 h-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

// ─── Image Modal Component ──────────────────────────────────────────
const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0F]/90 backdrop-blur-sm p-4 sm:p-10 animate-[fadeIn_0.2s_ease-out]"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center animate-scaleIn"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-0 right-0 md:-top-2 md:-right-2 lg:-top-6 lg:-right-6 z-10 w-10 h-10 rounded-full bg-[#1B1B20] hover:bg-red-500/90 text-white flex items-center justify-center border border-[#4A4455] hover:border-transparent transition-all duration-300 cursor-pointer shadow-xl"
                    aria-label="Close Preview"
                >
                    <CloseIcon />
                </button>
                
                {/* Constrained Image */}
                <img 
                    src={imageUrl} 
                    alt="Product Preview File" 
                    className="w-full h-full object-cover drop-shadow-[0_0_40px_rgba(0,0,0,0.5)] select-none rounded-xl overflow-hidden" 
                />
            </div>
        </div>
    );
};

// ─── Product Card Row Component ─────────────────────────────────────
const ProductRow = ({ product, onImageClick }) => {
    const defaultImage = "https://via.placeholder.com/150/1B1B20/4A4455?text=No+Image";
    const imageUrl = product?.images?.[0]?.url || defaultImage;
    const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: product?.price?.currency || 'INR' });
    const formattedPrice = currencyFormatter.format(product?.price?.amount || 0);

    return (
        <div className="group flex items-center justify-between p-4 mb-4 bg-[#1B1B20]/40 border border-[#4A4455]/15 rounded-2xl transition-all duration-300 hover:bg-[#1B1B20]/80 hover:border-[#7C3AED]/30 hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)] hover:-translate-y-0.5">
            <div className="flex items-center gap-5 flex-1 min-w-0 pr-4">
                {/* Thumbnail */}
                <div 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer relative bg-[#0D0D14] border border-[#4A4455]/20 group/img" 
                    onClick={() => onImageClick(imageUrl)}
                >
                    <img 
                        src={imageUrl} 
                        alt={product.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white backdrop-blur-[2px]">
                        <ZoomIcon />
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-[#E4E1E9] font-bold text-[15px] md:text-base mb-1.5 truncate transition-colors group-hover:text-[#D2BBFF]">
                        {product.title}
                    </h3>
                    <p className="text-[#958DA1] text-xs md:text-sm line-clamp-2 max-w-2xl leading-relaxed">
                        {product.description}
                    </p>
                </div>
            </div>

            {/* Price Badge */}
            <div className="shrink-0 text-right pl-4 border-l border-[#4A4455]/10 hidden sm:block">
                <span className="inline-block px-4 py-1.5 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#D2BBFF] text-sm md:text-[15px] font-semibold tracking-wide shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                    {formattedPrice}
                </span>
            </div>
        </div>
    );
};


// ─── Main ShowProduct Component ─────────────────────────────────────
const ShowProduct = () => {
    const { fetchSellerProducts } = useProducts();
    const { sellerProducts, loading } = useSelector(state => state.product);
    const navigate = useNavigate();
    
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch products on mount
    useEffect(() => {
        fetchSellerProducts();
    }, []);

    const handleAddProduct = () => {
        navigate("/seller/create-product");
    };

    return (
        <div className="h-screen bg-[#0A0A0F] font-[Poppins] relative p-6 lg:p-10 overflow-hidden">
            {/* ═══ Go Back Button ═══ */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 right-6 lg:top-8 lg:right-10 z-50 flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-[#958DA1] transition-all duration-300 hover:text-[#D2BBFF] cursor-pointer bg-transparent border-none outline-none group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to home
            </button>

            {/* ═══ Animated Background Gradients ═══ */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#7C3AED]/8 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#3B82F6]/6 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto flex flex-col h-full">
                
                {/* ═══ Header Section ═══ */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                            <span className="text-[#D2BBFF] text-[10px] uppercase tracking-[0.15em] font-medium">Inventory</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#E4E1E9] tracking-tight mb-2">
                            Your Products
                        </h1>
                        <p className="text-[#958DA1] text-sm tracking-wide">
                            Manage and view all your listed products on Snitch.
                        </p>
                    </div>

                    <button 
                        onClick={handleAddProduct}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                        <PlusIcon />
                        Add Product
                    </button>
                </div>

                {/* ═══ Main Data Container ═══ */}
                <div className="flex-1 min-h-0 bg-[#0D0D14]/80 border border-[#4A4455]/15 rounded-3xl p-6 lg:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col">
                    
                    {/* Header Row (Optional for premium feel) */}
                    {sellerProducts?.length > 0 && !loading && (
                        <div className="hidden sm:flex text-[#958DA1] text-xs uppercase tracking-[0.15em] font-semibold mb-4 px-4 pb-3 border-b border-[#4A4455]/20">
                            <div className="flex-1">Product Details</div>
                            <div className="w-32 text-right">Price</div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 min-h-0" style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4455 transparent" }}>
                        {loading ? (
                            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-[#7C3AED]">
                                <SpinnerIcon />
                                <p className="text-[#958DA1] text-sm mt-4 tracking-widest uppercase animate-pulse">Loading Products...</p>
                            </div>
                        ) : sellerProducts?.length > 0 ? (
                            <div className="flex flex-col gap-1">
                                {sellerProducts.map((product) => (
                                    <ProductRow 
                                        key={product._id} 
                                        product={product} 
                                        onImageClick={setSelectedImage} 
                                    />
                                ))}
                            </div>
                        ) : (
                            /* ═══ Empty State ═══ */
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                                <div className="text-[#4A4455] mb-6 animate-[float_6s_ease-in-out_infinite]">
                                    <EmptyBoxIcon />
                                </div>
                                <h3 className="text-xl font-bold text-[#E4E1E9] mb-2">No products found</h3>
                                <p className="text-[#958DA1] max-w-sm mb-8 text-sm">
                                    You haven't listed any products yet. Get started by adding your first product to your inventory.
                                </p>
                                <button 
                                    onClick={handleAddProduct}
                                    className="px-6 py-3 rounded-xl border border-[#7C3AED]/50 bg-[#7C3AED]/10 text-[#D2BBFF] font-semibold text-sm hover:bg-[#7C3AED]/20 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all duration-300 cursor-pointer"
                                >
                                    Create Your First Product
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* ═══ Image Modal ═══ */}
            <ImageModal 
                imageUrl={selectedImage} 
                onClose={() => setSelectedImage(null)} 
            />
        </div>
    );
};

export default ShowProduct;
