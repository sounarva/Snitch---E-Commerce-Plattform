import { useState } from "react";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useToast } from "../../../shared/Toaster";

// ─── SVG Icon Components ───────────────────────────────────────────
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
        <path d="m2 2 20 20" />
    </svg>
);

const BuyerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
);

const SellerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
        <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

// ─── Main Register Component ──────────────────────────────────────
const Register = () => {
    const { register, loading, error } = useAuth();
    const { showToast } = useToast()
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [role, setRole] = useState("buyer");
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        contactNumber: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register({
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
            contactNumber: formData.contactNumber,
            isSeller: role === "seller",
        });

        if (!result.success) {
            showToast(result.error, false);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0A0A0F] font-[Poppins] overflow-hidden">

            {/* ═══ LEFT PANEL — Branding ═══ */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative items-center justify-center overflow-hidden">

                {/* Animated gradient orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[15%] left-[20%] w-[340px] h-[340px] rounded-full bg-[#7C3AED]/20 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
                    <div className="absolute bottom-[20%] right-[10%] w-[280px] h-[280px] rounded-full bg-[#3B82F6]/15 blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
                    <div className="absolute top-[55%] left-[50%] w-[200px] h-[200px] rounded-full bg-[#8B5CF6]/10 blur-[80px] animate-[float_12s_ease-in-out_infinite_2s]" />
                </div>

                {/* Subtle grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Branding content */}
                <div className="relative z-10 px-12 xl:px-16 text-center">
                    {/* Logo */}
                    <h1 className="text-6xl xl:text-7xl font-bold text-white tracking-[0.35em] mb-6 select-none">
                        SNITCH
                    </h1>

                    {/* Gradient divider */}
                    <div className="mx-auto w-24 h-[2px] bg-linear-to-r from-transparent via-[#7C3AED] to-transparent mb-6" />

                    {/* Tagline */}
                    <p className="text-[#CCC3D8] text-lg xl:text-xl font-light tracking-[0.15em] uppercase">
                        Redefine Your Style
                    </p>

                    {/* Decorative accent below tagline */}
                    <p className="mt-8 text-[#4A4455] text-sm font-light tracking-wider max-w-xs mx-auto leading-relaxed">
                        Join the curated fashion community where style meets innovation.
                    </p>
                </div>

                {/* Bottom copyright */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                    <p className="text-[#35343A] text-xs tracking-wider">
                        © 2026 Snitch Digital Curator
                    </p>
                </div>
            </div>

            {/* ═══ RIGHT PANEL — Registration Form ═══ */}
            <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-20 bg-[#0D0D14] relative">

                {/* Subtle edge gradient where panels meet */}
                <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-[#7C3AED]/20 to-transparent" />

                {/* Form card container */}
                <div className="w-full max-w-md">

                    {/* Mobile logo (shown only on small screens) */}
                    <div className="lg:hidden text-center mb-10">
                        <h1 className="text-4xl font-bold text-white tracking-[0.3em]">SNITCH</h1>
                        <div className="mx-auto w-16 h-[2px] bg-linear-to-r from-transparent via-[#7C3AED] to-transparent mt-3" />
                    </div>

                    {/* Card header */}
                    <div className="mb-8">
                        <h2 className="text-2xl xl:text-3xl font-semibold text-[#E4E1E9] tracking-tight">
                            Create an account
                        </h2>
                        <p className="mt-2 text-[#958DA1] text-sm tracking-wide">
                            Join the curated fashion community.
                        </p>
                    </div>

                    {/* ─── Form ─── */}
                    <form onSubmit={handleSubmit} className="space-y-5" id="register-form">

                        {/* Full Name */}
                        <div className="group relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                <UserIcon />
                            </div>
                            <input
                                id="register-fullname"
                                type="text"
                                name="fullname"
                                placeholder="Full Name"
                                value={formData.fullname}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-[#1B1B20] rounded-xl text-[#E4E1E9] placeholder-[#4A4455] text-sm tracking-wide outline-none border border-[#4A4455]/20 transition-all duration-300 focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:bg-[#1F1F25] hover:border-[#4A4455]/40"
                            />
                        </div>

                        {/* Email */}
                        <div className="group relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                <MailIcon />
                            </div>
                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-[#1B1B20] rounded-xl text-[#E4E1E9] placeholder-[#4A4455] text-sm tracking-wide outline-none border border-[#4A4455]/20 transition-all duration-300 focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:bg-[#1F1F25] hover:border-[#4A4455]/40"
                            />
                        </div>

                        {/* Password */}
                        <div className="group relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                <LockIcon />
                            </div>
                            <input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-12 py-3.5 bg-[#1B1B20] rounded-xl text-[#E4E1E9] placeholder-[#4A4455] text-sm tracking-wide outline-none border border-[#4A4455]/20 transition-all duration-300 focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:bg-[#1F1F25] hover:border-[#4A4455]/40"
                            />
                            <button
                                type="button"
                                id="toggle-password-visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#958DA1] hover:text-[#D2BBFF] transition-colors duration-300 cursor-pointer"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>

                        {/* Contact Number */}
                        <div className="group relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                <PhoneIcon />
                            </div>
                            <input
                                id="register-contact"
                                type="tel"
                                name="contactNumber"
                                placeholder="Contact Number"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-[#1B1B20] rounded-xl text-[#E4E1E9] placeholder-[#4A4455] text-sm tracking-wide outline-none border border-[#4A4455]/20 transition-all duration-300 focus:border-[#7C3AED]/60 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] focus:bg-[#1F1F25] hover:border-[#4A4455]/40"
                            />
                        </div>

                        {/* ─── Role Selection Cards ─── */}
                        <div>
                            <label className="block text-[#958DA1] text-xs uppercase tracking-[0.12em] mb-3 font-medium">
                                I want to
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Buyer Card */}
                                <button
                                    type="button"
                                    id="role-buyer"
                                    onClick={() => setRole("buyer")}
                                    className={`relative group/card flex flex-col items-center gap-2 py-5 px-4 rounded-xl border transition-all duration-300 cursor-pointer
                    ${role === "buyer"
                                            ? "border-[#7C3AED]/60 bg-[#7C3AED]/8 shadow-[0_0_25px_rgba(124,58,237,0.12)]"
                                            : "border-[#4A4455]/20 bg-[#1B1B20] hover:border-[#4A4455]/40 hover:bg-[#1F1F25]"
                                        }`}
                                >
                                    {/* Active glow indicator */}
                                    {role === "buyer" && (
                                        <div className="absolute -top-px left-4 right-4 h-[2px] bg-linear-to-r from-transparent via-[#7C3AED] to-transparent" />
                                    )}
                                    <div className={`transition-colors duration-300 ${role === "buyer" ? "text-[#D2BBFF]" : "text-[#958DA1] group-hover/card:text-[#CCC3D8]"}`}>
                                        <BuyerIcon />
                                    </div>
                                    <span className={`text-sm font-medium tracking-wide transition-colors duration-300 ${role === "buyer" ? "text-[#E4E1E9]" : "text-[#958DA1] group-hover/card:text-[#CCC3D8]"}`}>
                                        Buyer
                                    </span>
                                    <span className={`text-[11px] tracking-wide transition-colors duration-300 ${role === "buyer" ? "text-[#958DA1]" : "text-[#4A4455]"}`}>
                                        Shop curated styles
                                    </span>
                                </button>

                                {/* Seller Card */}
                                <button
                                    type="button"
                                    id="role-seller"
                                    onClick={() => setRole("seller")}
                                    className={`relative group/card flex flex-col items-center gap-2 py-5 px-4 rounded-xl border transition-all duration-300 cursor-pointer
                    ${role === "seller"
                                            ? "border-[#7C3AED]/60 bg-[#7C3AED]/8 shadow-[0_0_25px_rgba(124,58,237,0.12)]"
                                            : "border-[#4A4455]/20 bg-[#1B1B20] hover:border-[#4A4455]/40 hover:bg-[#1F1F25]"
                                        }`}
                                >
                                    {role === "seller" && (
                                        <div className="absolute -top-px left-4 right-4 h-[2px] bg-linear-to-r from-transparent via-[#7C3AED] to-transparent" />
                                    )}
                                    <div className={`transition-colors duration-300 ${role === "seller" ? "text-[#D2BBFF]" : "text-[#958DA1] group-hover/card:text-[#CCC3D8]"}`}>
                                        <SellerIcon />
                                    </div>
                                    <span className={`text-sm font-medium tracking-wide transition-colors duration-300 ${role === "seller" ? "text-[#E4E1E9]" : "text-[#958DA1] group-hover/card:text-[#CCC3D8]"}`}>
                                        Seller
                                    </span>
                                    <span className={`text-[11px] tracking-wide transition-colors duration-300 ${role === "seller" ? "text-[#958DA1]" : "text-[#4A4455]"}`}>
                                        List your collection
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            id="register-submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl font-semibold text-sm uppercase tracking-[0.15em] text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <SpinnerIcon />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Login link */}
                    <p className="mt-8 text-center text-sm text-[#958DA1] tracking-wide">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            id="login-link"
                            className="text-[#D2BBFF] hover:text-white transition-colors duration-300 font-medium"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
