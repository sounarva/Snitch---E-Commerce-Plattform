import { useRef, useState } from "react";
import { COLORS } from "../../../data/data";
import ChevronDownIcon from "../../../svg/ChevronDownIcon";

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

export default ColorDropdown;