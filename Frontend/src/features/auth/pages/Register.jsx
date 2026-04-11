import { useState } from "react";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useToast } from "../../../shared/Toaster";
import authHero from "../../../assets/register-hero.png";

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

            {/* ═══ LEFT PANEL — Premium Branding ═══ */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative items-center justify-center overflow-hidden">

                {/* Full-bleed hero image */}
                <img
                    src={authHero}
                    alt="Premium fashion"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Dark gradient overlays for depth */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0F] via-[#0A0A0F]/60 to-[#0A0A0F]/30" />
                <div className="absolute inset-0 bg-linear-to-r from-[#0A0A0F]/20 to-[#0A0A0F]/50" />
                <div className="absolute inset-0 bg-[#7C3AED]/6" />

                {/* Animated gradient orbs — subtle over image */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[10%] left-[15%] w-[260px] h-[260px] rounded-full bg-[#7C3AED]/15 blur-[100px] animate-[float_8s_ease-in-out_infinite]" />
                    <div className="absolute bottom-[25%] right-[10%] w-[200px] h-[200px] rounded-full bg-[#3B82F6]/10 blur-[80px] animate-[float_10s_ease-in-out_infinite_reverse]" />
                </div>

                {/* Floating fashion tags */}
                <div className="absolute top-8 left-6 right-6 flex flex-wrap gap-2 z-10 pointer-events-none">
                    {["Luxury", "Essentials", "Limited Edition"].map((tag, i) => (
                        <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium border border-white/10 bg-white/6 text-white/60 backdrop-blur-md"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Branding content — glassmorphic card */}
                <div className="relative z-10 px-8 xl:px-12 w-full">
                    <div className="backdrop-blur-xl bg-white/4 border border-white/8 rounded-2xl p-8 xl:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.4)]">
                        {/* Logo */}
                        <h1 className="text-5xl xl:text-6xl font-bold text-white tracking-[0.35em] mb-4 select-none">
                            SNITCH
                        </h1>

                        {/* Gradient divider */}
                        <div className="w-16 h-[2px] bg-linear-to-r from-[#7C3AED] via-[#A78BFA] to-transparent mb-5" />

                        {/* Tagline */}
                        <p className="text-white/80 text-lg xl:text-xl font-light tracking-[0.12em] uppercase mb-3">
                            Redefine Your Style
                        </p>

                        {/* Description */}
                        <p className="text-white/40 text-sm font-light leading-relaxed max-w-sm">
                            Join the curated fashion community where style meets innovation. Discover collections that define the future.
                        </p>

                        {/* Trust indicators */}
                        <div className="mt-8 flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-white font-semibold text-lg tracking-wide">10K+</span>
                                <span className="text-white/35 text-[10px] uppercase tracking-[0.15em]">Brands</span>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-white font-semibold text-lg tracking-wide">50K+</span>
                                <span className="text-white/35 text-[10px] uppercase tracking-[0.15em]">Products</span>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-white font-semibold text-lg tracking-wide">99%</span>
                                <span className="text-white/35 text-[10px] uppercase tracking-[0.15em]">Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom testimonial strip */}
                <div className="absolute bottom-0 left-0 right-0 z-10">
                    <div className="bg-linear-to-t from-[#0A0A0F] via-[#0A0A0F]/90 to-transparent pt-16 pb-8 px-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex -space-x-2">
                                {[0, 1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="w-7 h-7 rounded-full border-2 border-[#0A0A0F]"
                                        style={{
                                            background: [
                                                'linear-gradient(135deg, #7C3AED, #3B82F6)',
                                                'linear-gradient(135deg, #A78BFA, #7C3AED)',
                                                'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                                                'linear-gradient(135deg, #6366F1, #A78BFA)',
                                            ][i],
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-white/50 text-xs tracking-wide">
                                Join <span className="text-white/80 font-medium">2,400+</span> fashion enthusiasts
                            </p>
                        </div>
                        <p className="text-white/25 text-[11px] tracking-wider">
                            © 2026 Snitch — Curated Digital Fashion
                        </p>
                    </div>
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
                    <div className="mb-6">
                        <h2 className="text-2xl xl:text-3xl font-semibold text-[#E4E1E9] tracking-tight">
                            Create an account
                        </h2>
                        <p className="mt-1 text-[#958DA1] text-sm tracking-wide">
                            Join the curated fashion community.
                        </p>
                    </div>

                    {/* ─── Form ─── */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4" id="register-form">

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
                        <div className="sm:col-span-2">
                            <label className="block text-[#958DA1] text-xs uppercase tracking-[0.12em] mb-2 font-medium">
                                I want to
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Buyer Card */}
                                <button
                                    type="button"
                                    id="role-buyer"
                                    onClick={() => setRole("buyer")}
                                    className={`relative group/card flex flex-col items-center gap-1.5 py-3 px-4 rounded-xl border transition-all duration-300 cursor-pointer
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
                                    className={`relative group/card flex flex-col items-center gap-1.5 py-3 px-4 rounded-xl border transition-all duration-300 cursor-pointer
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
                            className="w-full sm:col-span-2 py-3 rounded-xl font-semibold text-sm uppercase tracking-[0.15em] text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer flex items-center justify-center gap-2"
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

                    {/* ─── Divider ─── */}
                    <div className="flex items-center gap-4 my-5">
                        <div className="flex-1 h-px bg-linear-to-r from-transparent to-[#4A4455]/30" />
                        <span className="text-[#4A4455] text-xs uppercase tracking-[0.15em] font-medium">or</span>
                        <div className="flex-1 h-px bg-linear-to-l from-transparent to-[#4A4455]/30" />
                    </div>

                    {/* Google OAuth Button */}
                    <button
                        type="button"
                        onClick={() => window.location.href = "/api/v1/auth/google"}
                        className="w-full mb-6 py-3 rounded-xl font-medium text-sm tracking-wide text-[#E4E1E9] bg-[#1B1B20] border border-[#4A4455]/20 transition-all duration-300 hover:bg-[#1F1F25] hover:border-[#4A4455]/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center gap-3 cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Login link */}
                    <p className="text-center text-sm text-[#958DA1] tracking-wide">
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
