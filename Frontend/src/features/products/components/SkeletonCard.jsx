// ─── Skeleton Card Shimmer Loader ───────────────────────────────────
const SkeletonCard = ({ index = 0 }) => {
    return (
        <div
            className="relative bg-[#0D0D14]/80 border border-[#4A4455]/10 rounded-2xl overflow-hidden"
            style={{
                animation: `fadeIn 0.4s ease-out ${index * 0.1}s both`,
            }}
        >
            {/* Image Skeleton */}
            <div className="aspect-4/3 bg-[#1B1B20] relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(74,68,85,0.08) 40%, rgba(74,68,85,0.15) 50%, rgba(74,68,85,0.08) 60%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        animation: "skeletonShimmer 1.8s ease-in-out infinite",
                    }}
                />
            </div>

            {/* Content Skeleton */}
            <div className="p-5 space-y-3">
                {/* Title skeleton */}
                <div className="h-4 w-3/4 rounded-lg bg-[#1B1B20] relative overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(90deg, transparent 0%, rgba(74,68,85,0.12) 40%, rgba(74,68,85,0.2) 50%, rgba(74,68,85,0.12) 60%, transparent 100%)",
                            backgroundSize: "200% 100%",
                            animation: "skeletonShimmer 1.8s ease-in-out infinite 0.1s",
                        }}
                    />
                </div>

                {/* Description skeleton lines */}
                <div className="space-y-2">
                    <div className="h-3 w-full rounded-md bg-[#1B1B20] relative overflow-hidden">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(90deg, transparent 0%, rgba(74,68,85,0.12) 40%, rgba(74,68,85,0.2) 50%, rgba(74,68,85,0.12) 60%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                animation: "skeletonShimmer 1.8s ease-in-out infinite 0.2s",
                            }}
                        />
                    </div>
                    <div className="h-3 w-2/3 rounded-md bg-[#1B1B20] relative overflow-hidden">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(90deg, transparent 0%, rgba(74,68,85,0.12) 40%, rgba(74,68,85,0.2) 50%, rgba(74,68,85,0.12) 60%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                animation: "skeletonShimmer 1.8s ease-in-out infinite 0.3s",
                            }}
                        />
                    </div>
                </div>

                {/* Price skeleton */}
                <div className="pt-1">
                    <div className="h-8 w-24 rounded-lg bg-[#1B1B20] relative overflow-hidden">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.06) 40%, rgba(124,58,237,0.1) 50%, rgba(124,58,237,0.06) 60%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                animation: "skeletonShimmer 1.8s ease-in-out infinite 0.4s",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
