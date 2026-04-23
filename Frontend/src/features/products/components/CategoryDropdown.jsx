import { useRef, useState } from "react";
import ChevronDownIcon from "../../../svg/ChevronDownIcon";

const CategoryDropdown = ({ value, onChange, options, direction = "top" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (option) => {
        onChange(option);
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
                id="category-dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center w-full gap-3 px-4 py-3 bg-[#1B1B20] rounded-xl text-sm tracking-wide outline-none border transition-all duration-300 cursor-pointer justify-between
                    ${isOpen
                        ? "border-[#7C3AED]/60 shadow-[0_0_20px_rgba(124,58,237,0.15)] bg-[#1F1F25]"
                        : "border-[#4A4455]/20 hover:border-[#4A4455]/40"
                    }`}
            >
                <div className="flex items-center gap-3">
                    {value ? (
                        <span className="text-[#E4E1E9] font-medium">{value}</span>
                    ) : (
                        <span className="text-[#4A4455]">Select a category...</span>
                    )}
                </div>
                <span className={`transition-transform duration-300 text-[#958DA1] ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDownIcon />
                </span>
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute left-0 right-0 ${direction === "bottom" ? "bottom-full mb-2" : "top-full mt-2"} bg-[#1B1B20] border border-[#4A4455]/30 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50 transition-all duration-300 origin-top max-h-[240px] overflow-y-auto
                    ${isOpen
                        ? "opacity-100 scale-y-100 pointer-events-auto"
                        : "opacity-0 scale-y-95 pointer-events-none"
                    }`}
                style={{ scrollbarWidth: "thin", scrollbarColor: "#4A4455 transparent" }}
            >
                {options.map((category) => (
                    <button
                        type="button"
                        key={category}
                        id={`category-option-${category.toLowerCase().replace(/\s/g, "-")}`}
                        onClick={() => handleSelect(category)}
                        className={`w-full px-4 py-3 text-left text-sm tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-3
                            ${value === category
                                ? "bg-[#7C3AED]/10 text-[#D2BBFF]"
                                : "text-[#E4E1E9] hover:bg-[#4A4455]/15 hover:text-white"
                            }`}
                    >
                        <span>{category}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryDropdown;
