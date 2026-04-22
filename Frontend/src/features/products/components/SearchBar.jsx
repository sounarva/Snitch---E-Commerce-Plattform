import { useProducts } from '../hooks/useProducts'
import { useState, useEffect } from 'react'
import { Search, PackageX } from 'lucide-react'
import { useNavigate } from 'react-router'

const SearchBar = () => {
    const { searchProducts } = useProducts()
    const [query, setQuery] = useState("")
    const [results, setResults] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 1) {
                const response = await searchProducts(query)
                setResults(response)
            } else {
                setResults(null)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    return (
        <div className="relative w-full max-w-lg group">
            {/* Search Input Field */}
            <div className="relative flex items-center">
                <Search className="absolute left-4 size-5 text-[#958DA1] group-focus-within:text-purple-400 transition-colors duration-300" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-[#12121A] border border-white/10 rounded-full pl-12 pr-6 py-3 text-white placeholder:text-[#958DA1] focus:outline-none focus:border-purple-500/50 transition-all duration-300 search-input-glow"
                />
            </div>

            {/* Live Results Dropdown */}
            {query.trim().length > 0 && (
                <div className="absolute top-full left-0 mt-3 w-full search-glass rounded-2xl overflow-hidden shadow-2xl shadow-black/50 z-50 animate-search-dropdown border border-white/10">
                    <div className="max-h-[420px] overflow-y-auto search-results-container py-2">
                        {results && results.products && results.products.length > 0 ? (
                            results.products.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => {
                                        navigate(`/product/${product._id}`)
                                        setQuery("")
                                    }}
                                    className="flex items-center gap-4 px-4 py-3 search-result-item cursor-pointer group/item mx-2 rounded-xl mb-1"
                                >
                                    {/* Product Image */}
                                    <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                                        <img
                                            src={product.images[0]?.url}
                                            alt={product.title}
                                            className="w-full h-full object-cover search-result-image transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Product Title */}
                                    <div className="grow min-w-0">
                                        <h4 className="text-sm font-medium text-[#E4E1E9] group-hover/item:text-white transition-colors line-clamp-1">
                                            {product.title}
                                        </h4>
                                        <p className="text-[10px] text-[#958DA1] uppercase tracking-wider mt-0.5">
                                            View Product
                                        </p>
                                    </div>

                                    {/* Subtle Hover Indicator */}
                                    <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                                        <Search className="size-4 text-purple-400" />
                                    </div>
                                </div>
                            ))
                        ) : results && results.products && results.products.length === 0 ? (
                            <div className="px-6 py-12 flex flex-col items-center justify-center text-[#958DA1]">
                                <PackageX className="size-8 mb-3 opacity-20" />
                                <p className="text-sm font-medium">No products found</p>
                                <p className="text-[11px] opacity-60 mt-1">Try a different keyword</p>
                            </div>
                        ) : query.trim().length >= 1 ? (
                            <div className="px-6 py-8 flex items-center justify-center gap-3">
                                <div className="size-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                                <span className="text-xs text-[#958DA1] font-medium tracking-wide uppercase">Searching...</span>
                            </div>
                        ) : null}
                    </div>

                    {/* Dropdown Footer */}
                    {results && results.products && results.products.length > 0 && (
                        <div className="px-4 py-2 bg-white/2 border-t border-white/5 text-[10px] text-[#958DA1] text-center tracking-widest uppercase">
                            Showing {results.products.length} results
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchBar