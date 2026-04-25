import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router";
import PlusIcon from "../../../svg/PlusIcon";
import EmptyBoxIcon from "../../../svg/EmptyBoxIcon";
import SpinnerIcon from "../../../svg/SpinnerIcon";
import ImageModal from "../components/ImageModal";
import ProductRow from "../components/ProductRow";


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
                    <path d="m15 18-6-6 6-6" />
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
                        <div className="hidden sm:flex text-[#958DA1] text-xs uppercase tracking-[0.15em] font-semibold mb-4 px-4 pb-3 border-b border-[#4A4455]/20 gap-4">
                            <div className="flex-1">Product Details</div>
                            <div className="w-[130px] text-center">Actions</div>
                            <div className="w-[140px] text-right">Price</div>
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
                                        navigate={navigate}
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
