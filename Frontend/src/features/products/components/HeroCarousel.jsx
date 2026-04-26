import React, { useState, useEffect } from "react";
import hero1 from "../../../assets/hero-1.avif";
import hero2 from "../../../assets/hero-2.avif";
import hero3 from "../../../assets/hero-3.avif";

const slides = [
    {
        image: hero1,
        title: "Neon Nights Collection",
        subtitle: "Premium Streetwear for the Urban Explorer",
    },
    {
        image: hero2,
        title: "Futuristic Elegance",
        subtitle: "Luxury redefined with dark aesthetics.",
    },
    {
        image: hero3,
        title: "The Void Series",
        subtitle: "High-end apparel floating beyond boundaries.",
    },
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);

    // Auto-advance slides every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    return (
        <div className="relative w-full h-[600px] lg:h-[800px] overflow-hidden group">
            {/* Slides container */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Image with slow zoom animation */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            animation: index === current ? "heroZoom 5s linear forwards" : "none",
                        }}
                    />

                    {/* Gradient Overlays for smooth blending into dark theme */}
                    {/* Top gradient to ensure navbar visibility */}
                    <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#0A0A0F]/80 to-transparent" />

                    {/* Bottom gradient to blend with next section */}
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#0A0A0F] to-transparent z-10" />

                    {/* Left gradient for text readability */}
                    <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 bg-linear-to-r from-[#0A0A0F]/90 via-[#0A0A0F]/50 to-transparent" />

                    {/* Slide Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-40 z-20">
                        <div
                            className={`max-w-2xl transform transition-all duration-1200 delay-300 ${index === current ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                                }`}
                        >
                            {/* Premium Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/10 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                                <div className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
                                <span className="text-[#D2BBFF] text-xs uppercase tracking-[0.25em] font-semibold">
                                    Featured Drop
                                </span>
                            </div>

                            {/* Headline */}
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-[#E4E1E9] to-[#958DA1] tracking-tight mb-6 leading-[1.1] drop-shadow-xl">
                                {slide.title}
                            </h2>

                            {/* Subtitle */}
                            <p className="text-md sm:text-xl text-[#D2BBFF]/80 font-light max-w-xl leading-relaxed mb-10 drop-shadow-md">
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* ═══ Navigation Controls ═══ */}

            {/* Dots */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-30 bg-[#0A0A0F]/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/5">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`transition-all duration-500 rounded-full h-1.5 ${index === current
                            ? "w-10 bg-linear-to-r from-[#7C3AED] to-[#3B82F6] shadow-[0_0_10px_rgba(124,58,237,0.6)]"
                            : "w-3 bg-white/30 hover:bg-white/60 hover:scale-110 cursor-pointer"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Arrow Navigation (Hidden on mobile, hover reveal on desktop) */}
            <div className="hidden sm:block">
                <button
                    onClick={prevSlide}
                    className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/40 text-white backdrop-blur-xl border border-white/10 hover:bg-[#7C3AED]/60 hover:border-[#7C3AED]/80 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    aria-label="Previous slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/40 text-white backdrop-blur-xl border border-white/10 hover:bg-[#7C3AED]/60 hover:border-[#7C3AED]/80 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    aria-label="Next slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default HeroCarousel;
