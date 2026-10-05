import { useState, useEffect } from 'react';
import { Timer, ArrowRight, Sparkles, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';

interface DealsSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  categorySlug?: string;
  hasTimer?: boolean;
  showPromoBanner?: boolean;
}

export const DealsSection = ({
  title,
  subtitle = 'Top Deals Handpicked For You',
  products,
  categorySlug = 'all',
  hasTimer = true,
  showPromoBanner = true,
}: DealsSectionProps) => {
  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 42 });

  useEffect(() => {
    if (!hasTimer) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasTimer]);

  const displayProducts = products.slice(0, 6);

  return (
    <div className="w-full bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden my-4">
      <div className="flex flex-col lg:flex-row">
        
        {/* Main Deals Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  {title}
                  {hasTimer && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                      <Timer className="h-3.5 w-3.5 animate-pulse text-red-600" />
                      {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s Left
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
              </div>
            </div>

            <Link
              to={categorySlug === 'all' ? '/products' : `/products?category=${categorySlug}`}
              className="bg-[#2874f0] hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-sm uppercase tracking-wider transition-colors inline-flex items-center gap-1 shadow-sm"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Product Items Rail */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4">
            {displayProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group flex flex-col items-center p-2 rounded hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200 text-center"
              >
                <div className="w-full aspect-square relative mb-2 flex items-center justify-center overflow-hidden bg-gray-50 rounded">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                    onError={(e) => {
                      const categoryFallbacks: Record<string, string> = {
                        electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
                        fashion: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
                        groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=500&fit=crop',
                        home: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&h=500&fit=crop',
                      };
                      (e.target as HTMLImageElement).src = categoryFallbacks[product.category] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop';
                    }}
                  />
                  {product.discount && (
                    <span className="absolute top-1 left-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                <h4 className="text-xs md:text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-[#2874f0] transition-colors w-full">
                  {product.name}
                </h4>

                <div className="mt-1">
                  <span className="text-xs md:text-sm font-bold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[11px] text-gray-400 line-through ml-1.5">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-semibold text-green-700 mt-0.5">
                  {product.discount ? `Extra ${product.discount}% Off` : 'Special Price'}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side Flipkart Sponsored Banner */}
        {showPromoBanner && (
          <div className="w-full lg:w-[240px] bg-gradient-to-br from-[#0c2340] to-[#1d4ed8] p-5 text-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-blue-900/30 flex-shrink-0">
            <div>
              <div className="inline-flex items-center gap-1 bg-[#ffe500] text-[#2874f0] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase mb-3">
                <Sparkles className="h-3 w-3 fill-[#2874f0]" /> Bank Offer
              </div>
              <h4 className="text-lg font-extrabold leading-snug">
                ShopHub Super Platinum Card
              </h4>
              <p className="text-xs text-blue-100 mt-2 leading-relaxed">
                Enjoy <span className="text-yellow-300 font-bold">5% Unlimited Cashback</span> on every purchase. No upper limit!
              </p>
              <div className="mt-4 p-2.5 rounded bg-white/10 backdrop-blur-sm border border-white/15 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-yellow-300" />
                  <span className="font-semibold">₹500 Welcome Bonus</span>
                </div>
                <p className="text-[10px] text-blue-200">Instant approval & zero joining fee</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/20">
              <Link
                to="/products"
                className="w-full bg-[#ffe500] hover:bg-yellow-400 text-gray-900 text-xs font-bold py-2 rounded text-center block transition-colors shadow"
              >
                Apply & Shop Now
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
