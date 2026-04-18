import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import HeroCarousel from "../components/HeroCarousel";
import EmptyBoxIcon from "../../../svg/EmptyBoxIcon";
import PlusIcon from "../../../svg/PlusIcon";

// ─── Main Home Component ────────────────────────────────────────────
const Home = () => {
    const { fetchAllProducts } = useProducts();
    const { allProducts, loading } = useSelector((state) => state.product);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Fetch all products on mount
    useEffect(() => {
        fetchAllProducts();
    }, []);

    const isSeller = user?.role === "seller";

    return (
        <div className="min-h-screen bg-[#0A0A0F] font-[Poppins] relative">
            {/* ═══ Animated Background Gradient Orbs ═══ */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[5%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#7C3AED]/8 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute top-[30%] right-[5%] w-[350px] h-[350px] rounded-full bg-[#3B82F6]/6 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute bottom-[10%] left-[25%] w-[300px] h-[300px] rounded-full bg-[#A78BFA]/5 blur-[100px] animate-[float_12s_ease-in-out_infinite]" />
            </div>

            {/* ═══ Navbar ═══ */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* ═══ Hero Section ═══ */}
            <div className="relative z-40">
                <HeroCarousel />
            </div>

            {/* ═══ Main Content ═══ */}
            <main className="relative z-10 max-w-[1280px] mx-auto px-8 pt-16 pb-16">

                {/* ═══ Section Header ═══ */}
                <div className="mb-12 animate-[fadeIn_0.6s_ease-out]">
                    {/* Brand Pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                        <span className="text-[#D2BBFF] text-[10px] uppercase tracking-[0.15em] font-medium">
                            Curated Collection
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        id="home-title"
                        className="text-4xl lg:text-5xl font-bold text-[#E4E1E9] tracking-tight mb-3"
                    >
                        Explore Products
                    </h1>

                    {/* Subtitle */}
                    <p className="text-[#958DA1] text-sm tracking-wide max-w-lg">
                        Discover premium fashion pieces, curated for the modern lifestyle.
                    </p>

                    {/* Gradient underline */}
                    <div className="mt-5 w-20 h-[2px] bg-linear-to-r from-[#7C3AED] via-[#A78BFA] to-transparent" />
                </div>

                {/* ═══ Products Grid ═══ */}
                {loading ? (
                    /* ─── Skeleton Loading State ─── */
                    <div
                        id="products-skeleton-grid"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={`skeleton-${i}`} index={i} />
                        ))}
                    </div>
                ) : allProducts?.length > 0 ? (
                    /* ─── Products Grid ─── */
                    <div
                        id="products-grid"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {allProducts.map((product, index) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    /* ─── Empty State ─── */
                    <div
                        id="products-empty-state"
                        className="flex flex-col items-center justify-center text-center py-24 animate-[fadeIn_0.5s_ease-out]"
                    >
                        <div className="text-[#4A4455] mb-6 animate-[float_6s_ease-in-out_infinite]">
                            <EmptyBoxIcon />
                        </div>

                        <h3 className="text-2xl font-bold text-[#E4E1E9] mb-3">
                            No products available
                        </h3>

                        <p className="text-[#958DA1] max-w-md mb-8 text-sm leading-relaxed">
                            There are no products listed yet. Check back soon for fresh drops and curated fashion pieces.
                        </p>

                        {isSeller && (
                            <button
                                id="empty-state-add-product"
                                onClick={() => navigate("/seller/create-product")}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                            >
                                <PlusIcon />
                                Add Product
                            </button>
                        )}
                    </div>
                )}
            </main>

            {/* ═══ Footer ═══ */}
            <footer className="relative z-10 pb-8 pt-12">
                <div className="max-w-[1280px] mx-auto px-8">
                    {/* Gradient divider */}
                    <div
                        className="h-px mb-8"
                        style={{
                            background: "linear-gradient(90deg, transparent 0%, rgba(74,68,85,0.3) 30%, rgba(74,68,85,0.3) 70%, transparent 100%)",
                        }}
                    />
                    <p className="text-[#4A4455] text-[10px] tracking-[0.2em] font-medium uppercase text-center">
                        © 2026 Snitch — Curated Digital Fashion
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;