import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { useOrder } from '../hooks/useOrder';
import Navbar from "../../products/components/Navbar";

const Order = () => {
  const { fetchOrders } = useOrder();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Formatting Utilities
  const formatDate = (isoString) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(isoString));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading && orders.length === 0) {
    return (
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center font-[Poppins]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#7C3AED]/20 border-t-[#D2BBFF] rounded-full animate-spin" />
                <span className="text-[#958DA1] text-sm tracking-widest uppercase">Loading Orders...</span>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E4E1E9] font-['Poppins',sans-serif] relative flex flex-col">
      {/* ═══ Navbar ═══ */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* ─── Animated Background Blobs ─── */}
      <div 
        className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none"
        style={{ animation: 'orderBlobPulse 10s ease-in-out infinite' }}
      />
      <div 
        className="fixed bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-[#3B82F6]/10 rounded-full blur-[100px] pointer-events-none"
        style={{ animation: 'orderBlobPulse 12s ease-in-out infinite reverse' }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-24 pb-12 grow flex flex-col">
        {orders && orders.length > 0 ? (
          <>
            {/* ─── Header Section ─── */}
            <div className="mb-10 text-center md:text-left" style={{ animation: 'orderFadeIn 0.6s ease-out forwards' }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-gray-200 to-gray-400">
                Your Orders
              </h1>
              <p className="text-gray-400 text-lg">
                Track and review your past purchases
              </p>
              <div className="h-px w-full max-w-xl bg-linear-to-r from-purple-500/30 via-blue-500/30 to-transparent mt-6 hidden md:block" />
            </div>

            {/* ─── Orders List Section ─── */}
            <div className="flex flex-col gap-8 grow">
              {orders.map((order, orderIndex) => (
                <div 
                  key={order._id}
                  className="bg-[#13111C]/80 backdrop-blur-xl border border-[#ffffff0a] rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-[0_10px_30px_rgba(124,58,237,0.15)] group"
                  style={{ 
                    animation: 'orderFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    animationDelay: `${orderIndex * 0.15 + 0.1}s`,
                    opacity: 0
                  }}
                >
                  {/* 📦 Order Card Design: Top Row */}
                  <div className="flex flex-wrap gap-4 items-center justify-between border-b border-[#ffffff0a] pb-5 mb-5 relative">
                    {/* Subtle hover glow line */}
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-purple-500 to-blue-500 transition-all duration-500 group-hover:w-full opacity-50" />
                    
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Order ID</span>
                        <span className="text-sm md:text-base font-mono bg-[#ffffff05] px-3 py-1.5 rounded-md text-gray-300 border border-[#ffffff08] shadow-inner">
                          {order._id}
                        </span>
                      </div>
                      <div className="h-10 w-px bg-[#ffffff10] mx-2 hidden sm:block" />
                      <div className="flex flex-col sm:flex">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Placed On</span>
                        <span className="text-sm font-medium text-gray-400 tracking-wide mt-1.5">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div>
                      {order.paymentStatus === 'paid' ? (
                        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Paid
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Failed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 📦 Middle Section (Order Items) */}
                  <div className="flex flex-col gap-6">
                    {order.items.map((item, idx) => (
                      <div 
                        key={`${order._id}-${idx}`} 
                        className="flex gap-5 items-center group/item relative p-3 -mx-3 rounded-xl hover:bg-[#ffffff03] transition-colors"
                      >
                        {/* Left: Product Image */}
                        <div className="w-20 h-24 md:w-24 md:h-28 rounded-xl overflow-hidden shrink-0 bg-[#0A0A0F] border border-[#ffffff0a] shadow-lg relative">
                          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent z-10" />
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/item:scale-110 flex items-center justify-center text-[#4A4455] text-xs text-center wrap-break-word" 
                          />
                        </div>
                        
                        {/* Center: Product Info */}
                        <div className="grow flex flex-col justify-center gap-1.5">
                          <h3 className="font-semibold text-base md:text-lg text-gray-100 line-clamp-1 group-hover/item:text-white transition-colors duration-200">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.color !== "" && (
                              <span className="bg-[#ffffff08] border border-[#ffffff0a] px-2.5 py-1 rounded-md text-xs text-gray-400 font-medium tracking-wide">
                                Color: <span className="text-gray-200">{item.color}</span>
                              </span>
                            )}
                            {item.size !== "" && (
                              <span className="bg-[#ffffff08] border border-[#ffffff0a] px-2.5 py-1 rounded-md text-xs text-gray-400 font-medium tracking-wide">
                                Size: <span className="text-gray-200">{item.size}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Right: Price + Quantity */}
                        <div className="text-right flex flex-col justify-center min-w-[80px]">
                          <span className="font-bold text-gray-200 mb-1 block">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {formatCurrency(item.price)} × {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 📦 Bottom Section: Total Amount */}
                  <div className="mt-7 pt-5 border-t border-[#ffffff0a] flex items-center justify-between bg-linear-to-r from-transparent via-[#ffffff02] to-transparent -mx-6 px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-medium">Order Total</span>
                      <span className="text-xs text-gray-500 hidden sm:inline">({order.items.reduce((acc, curr) => acc + curr.quantity, 0)} items)</span>
                    </div>
                    <div className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ─── Empty State ─── */
          <div 
            className="flex flex-col items-center justify-center text-center py-24 animate-[fadeIn_0.5s_ease-out] grow"
          >
            <div className="text-[#4A4455] mb-8 animate-[float_6s_ease-in-out_infinite]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-[#E4E1E9] mb-3 tracking-tight">
              No orders placed yet
            </h2>

            <p className="text-[#958DA1] max-w-md mb-8 text-sm leading-relaxed">
              Your order history is currently empty. Explore our latest premium collections and find your next favorite piece.
            </p>
            
            <Link 
              to="/"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white bg-linear-to-r from-[#7C3AED] to-[#3B82F6] hover:shadow-[0_0_35px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
              </svg>
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
