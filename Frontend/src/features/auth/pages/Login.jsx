import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useToast } from "../../../shared/Toaster";

// ─── SVG Icon Components ───────────────────────────────────────────
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

const SpinnerIcon = () => (
    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

// ─── Main Login Component ─────────────────────────────────────────
const Login = () => {
    const { login, loading } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login({
            email: formData.email,
            password: formData.password,
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
                        Welcome back to the curated fashion community where style meets innovation.
                    </p>
                </div>

                {/* Bottom copyright */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                    <p className="text-[#35343A] text-xs tracking-wider">
                        © 2026 Snitch Digital Curator
                    </p>
                </div>
            </div>

            {/* ═══ RIGHT PANEL — Login Form ═══ */}
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
                            Welcome back
                        </h2>
                        <p className="mt-2 text-[#958DA1] text-sm tracking-wide">
                            Sign in to your account to continue.
                        </p>
                    </div>

                    {/* ─── Form ─── */}
                    <form onSubmit={handleSubmit} className="space-y-5" id="login-form">

                        {/* Email */}
                        <div className="group relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#958DA1] transition-colors duration-300 group-focus-within:text-[#D2BBFF]">
                                <MailIcon />
                            </div>
                            <input
                                id="login-email"
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
                                id="login-password"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            id="login-submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl font-semibold text-sm uppercase tracking-[0.15em] text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <SpinnerIcon />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* ─── Divider ─── */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-linear-to-r from-transparent to-[#4A4455]/30" />
                        <span className="text-[#4A4455] text-xs uppercase tracking-[0.15em] font-medium">or</span>
                        <div className="flex-1 h-px bg-linear-to-l from-transparent to-[#4A4455]/30" />
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm text-[#958DA1] tracking-wide">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            id="register-link"
                            className="text-[#D2BBFF] hover:text-white transition-colors duration-300 font-medium"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
