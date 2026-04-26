// ─── Skeleton Card Shimmer Loader ───────────────────────────────────
const SkeletonCard = ({ index = 0 }) => {
    return (
        <div
            className="relative bg-[#141418] border border-[#2a2a32] rounded-2xl overflow-hidden"
            style={{
                animation: `fadeIn 0.4s ease-out ${index * 0.1}s both`,
            }}
        >
            {/* Image Skeleton (square aspect ratio to match card) */}
            <div className="aspect-square bg-[#1a1a24] relative overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(58,58,74,0.08) 40%, rgba(58,58,74,0.15) 50%, rgba(58,58,74,0.08) 60%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        animation: "skeletonShimmer 1.8s ease-in-out infinite",
                    }}
                />
            </div>

            {/* Content Skeleton */}
            <div className="p-5 space-y-3">
                {/* Title skeleton */}
                <div className="h-4 w-3/4 rounded-lg bg-[#1e1e28] relative overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(90deg, transparent 0%, rgba(58,58,74,0.12) 40%, rgba(58,58,74,0.2) 50%, rgba(58,58,74,0.12) 60%, transparent 100%)",
                            backgroundSize: "200% 100%",
                            animation: "skeletonShimmer 1.8s ease-in-out infinite 0.1s",
                        }}
                    />
                </div>

                {/* Description skeleton lines */}
                <div className="space-y-2">
                    <div className="h-3 w-full rounded-md bg-[#1e1e28] relative overflow-hidden">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(90deg, transparent 0%, rgba(58,58,74,0.12) 40%, rgba(58,58,74,0.2) 50%, rgba(58,58,74,0.12) 60%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                animation: "skeletonShimmer 1.8s ease-in-out infinite 0.2s",
                            }}
                        />
                    </div>
                    <div className="h-3 w-2/3 rounded-md bg-[#1e1e28] relative overflow-hidden">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(90deg, transparent 0%, rgba(58,58,74,0.12) 40%, rgba(58,58,74,0.2) 50%, rgba(58,58,74,0.12) 60%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                animation: "skeletonShimmer 1.8s ease-in-out infinite 0.3s",
                            }}
                        />
                    </div>
                </div>

                {/* Price + Button skeleton row */}
                <div className="pt-2 flex items-center justify-between gap-3">
                    <div className="h-9 w-20 rounded-xl bg-[#1e1e28] relative overflow-hidden">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(90deg, transparent 0%, rgba(58,58,74,0.1) 40%, rgba(58,58,74,0.15) 50%, rgba(58,58,74,0.1) 60%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                animation: "skeletonShimmer 1.8s ease-in-out infinite 0.4s",
                            }}
                        />
                    </div>
                    <div className="h-9 w-24 rounded-xl bg-[#1e1e28] relative overflow-hidden">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(90deg, transparent 0%, rgba(58,58,74,0.1) 40%, rgba(58,58,74,0.15) 50%, rgba(58,58,74,0.1) 60%, transparent 100%)",
                                backgroundSize: "200% 100%",
                                animation: "skeletonShimmer 1.8s ease-in-out infinite 0.5s",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
