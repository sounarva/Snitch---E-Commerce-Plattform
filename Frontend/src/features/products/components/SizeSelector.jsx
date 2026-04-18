import { CLOTHING_SIZES, NUMERIC_SIZES } from "../../../data/data";

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

export default SizeSelector;