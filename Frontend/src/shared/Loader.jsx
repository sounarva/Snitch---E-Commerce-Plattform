import React from 'react'

const Loader = () => {
    return (
        <div id="snitch-loader" className="loader-overlay">
            {/* ─── Background Gradient Orbs ─── */}
            <div className="loader-orb-purple" />
            <div className="loader-orb-blue" />

            {/* ─── Content Container ─── */}
            <div className="loader-content">
                {/* ─── Dual-Ring Spinner ─── */}
                <div className="loader-spinner">
                    {/* Outer ring */}
                    <svg width="80" height="80" viewBox="0 0 80 80" className="loader-ring-outer">
                        <defs>
                            <linearGradient id="loaderGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#7C3AED" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="40" cy="40" r="35"
                            fill="none"
                            stroke="url(#loaderGrad1)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray="165 55"
                            opacity="0.9"
                        />
                    </svg>

                    {/* Inner ring — counter-rotating */}
                    <svg width="80" height="80" viewBox="0 0 80 80" className="loader-ring-inner">
                        <defs>
                            <linearGradient id="loaderGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#A78BFA" />
                                <stop offset="100%" stopColor="#7C3AED" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="40" cy="40" r="25"
                            fill="none"
                            stroke="url(#loaderGrad2)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray="100 57"
                            opacity="0.6"
                        />
                    </svg>

                    {/* Center glow dot */}
                    <div className="loader-center-dot" />
                </div>

                {/* ─── Brand Text ─── */}
                <div className="loader-brand-wrapper">
                    <h1 className="loader-brand-text">SNITCH</h1>
                    <div className="loader-divider" />
                </div>

                {/* ─── Progress Bar ─── */}
                <div className="loader-progress-track">
                    <div className="loader-progress-fill" />
                </div>

                {/* ─── Loading Text with Animated Dots ─── */}
                <div className="loader-text-wrapper">
                    <span className="loader-text">Loading</span>
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="loader-dot"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        >
                            .
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Loader