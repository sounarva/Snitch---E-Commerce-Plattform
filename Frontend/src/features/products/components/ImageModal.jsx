import CloseIcon from "../../../svg/CloseIcon";

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

export default ImageModal;
