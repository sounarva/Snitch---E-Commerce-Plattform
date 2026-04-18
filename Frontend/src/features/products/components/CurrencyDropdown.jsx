import { useRef, useState } from "react";
import ChevronDownIcon from "../../../svg/ChevronDownIcon";

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

export default CurrencyDropdown;
