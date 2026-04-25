import { createContext, useContext, useState, useCallback, useEffect } from "react";

// ─── Icons ─────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// ─── Toast Context ─────────────────────────────────────────────────
const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// ─── Single Toast Component ────────────────────────────────────────
const Toast = ({ id, message, success, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss after 4 seconds
    const dismissTimer = setTimeout(() => handleClose(), 4000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={`
        relative flex items-center gap-3 px-5 py-3.5 rounded-xl
        border backdrop-blur-xl
        transition-all duration-300 ease-out
        min-w-[320px] max-w-[420px] w-full
        font-[Poppins] cursor-pointer group
        ${isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-[120%] opacity-0"
        }
        ${success
          ? "bg-[#0A2A1B]/80 border-[#34D399]/25 shadow-[0_8px_40px_rgba(52,211,153,0.12)]"
          : "bg-[#2A0A0A]/80 border-[#FF6B6B]/25 shadow-[0_8px_40px_rgba(255,107,107,0.12)]"
        }
      `}
      onClick={handleClose}
    >
      {/* Accent line on the left */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${success
            ? "bg-linear-to-b from-[#34D399] to-[#059669]"
            : "bg-linear-to-b from-[#FF6B6B] to-[#DC2626]"
          }`}
      />

      {/* Icon */}
      <div
        className={`shrink-0 p-1.5 rounded-lg ${success
            ? "bg-[#34D399]/15 text-[#34D399]"
            : "bg-[#FF6B6B]/15 text-[#FF6B6B]"
          }`}
      >
        {success ? <CheckIcon /> : <XCircleIcon />}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${success ? "text-[#34D399]" : "text-[#FF6B6B]"
          }`}>
          {success ? "Success" : "Error"}
        </p>
        <p className="text-sm text-[#E4E1E9] leading-snug truncate">
          {message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className="shrink-0 text-[#958DA1] hover:text-[#E4E1E9] transition-colors duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Close toast"
      >
        <CloseIcon />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full overflow-hidden bg-[#4A4455]/20">
        <div
          className={`h-full rounded-full ${success
              ? "bg-linear-to-r from-[#34D399] to-[#059669]"
              : "bg-linear-to-r from-[#FF6B6B] to-[#DC2626]"
            }`}
          style={{
            animation: isVisible && !isLeaving ? "shrink 4s linear forwards" : "none",
          }}
        />
      </div>
    </div>
  );
};

// ─── Toast Provider ────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, success = true) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, success }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container — fixed top-right */}
      <div className="fixed top-6 right-6 z-9999 flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            success={toast.success}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
