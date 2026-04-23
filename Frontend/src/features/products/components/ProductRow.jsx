import PlusIcon from "../../../svg/PlusIcon";
import ZoomIcon from "../../../svg/ZoomIcon";

const ProductRow = ({ product, onImageClick, navigate }) => {
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

            {/* Actions & Price */}
            <div className="flex items-center gap-4 shrink-0 sm:flex">
                <div className="w-[140px] flex flex-col gap-2 justify-center">
                    <button
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent border border-[#7C3AED]/30 text-[#D2BBFF] text-xs font-semibold tracking-wide hover:bg-[#7C3AED]/10 hover:border-[#7C3AED]/50 hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all duration-300 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/seller/add-variants/${product._id}`);
                        }}
                    >
                        <PlusIcon />
                        Add Variants
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/seller/edit-product/${product._id}`);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent border border-[#4A4455]/40 text-[#958DA1] text-xs font-semibold tracking-wide hover:bg-[#4A4455]/10 hover:border-[#7C3AED]/40 hover:text-[#D2BBFF] transition-all duration-300 cursor-pointer"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit Product
                    </button>
                </div>

                {/* Price Badge */}
                <div className="w-[100px] sm:w-[140px] flex justify-end pl-4 border-l border-[#4A4455]/20">
                    <span className="inline-block px-4 py-1.5 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#D2BBFF] text-sm md:text-[15px] font-semibold tracking-wide shadow-[0_0_15px_rgba(124,58,237,0.1)] truncate max-w-full">
                        {formattedPrice}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductRow;