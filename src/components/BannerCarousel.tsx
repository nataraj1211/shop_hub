import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BannerSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  offer: string;
  category: string;
  gradient: string;
  imageUrl: string;
  tag: string;
}

const slides: BannerSlide[] = [
  {
    id: '1',
    badge: 'BIG BILLION SAVINGS',
    title: 'Flagship Smartphones & 5G Tech',
    subtitle: 'India’s biggest tech discounts live now',
    offer: 'Starting ₹6,999 | Extra ₹3,000 Off on Exchange',
    category: 'electronics',
    gradient: 'from-[#002f6c] via-[#0250a3] to-[#0470dc]',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=450&fit=crop',
    tag: '⚡ 24 Hours Only',
  },
  {
    id: '2',
    badge: 'FASHION BLOCKBUSTER',
    title: 'Trendy Ethnic & Western Wear',
    subtitle: 'Top fashion brands at jaw-dropping prices',
    offer: '50% - 80% OFF + Extra 10% on Axis Cards',
    category: 'fashion',
    gradient: 'from-[#6a0d45] via-[#941b63] to-[#d63384]',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=450&fit=crop',
    tag: '👗 Top Brands',
  },
  {
    id: '3',
    badge: 'SMART APPLIANCES',
    title: '4K Smart TVs & Home Audio',
    subtitle: 'Upgrade your living room entertainment',
    offer: 'Up to 65% OFF | No Cost EMI from ₹1,299/mo',
    category: 'electronics',
    gradient: 'from-[#0b2b40] via-[#104e68] to-[#167d9c]',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=450&fit=crop',
    tag: '🌟 ShopHub Assured',
  },
  {
    id: '4',
    badge: 'SHOPHUB SUPERMARKET',
    title: 'Everyday Groceries & Essentials',
    subtitle: 'Fresh staple food, cooking oils & daily snacks',
    offer: 'Deals starting at ₹1 | Same Day Free Delivery',
    category: 'groceries',
    gradient: 'from-[#14471e] via-[#1f7331] to-[#2aa645]',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=450&fit=crop',
    tag: '🥦 100% Fresh',
  },
  {
    id: '5',
    badge: 'FURNITURE & DECOR',
    title: 'Modern Living & Kitchen Furniture',
    subtitle: 'Ergonomic chairs, coffee tables & cookware',
    offer: 'Flat 40% - 70% OFF | Free Installation',
    category: 'home',
    gradient: 'from-[#3e2723] via-[#5d4037] to-[#795548]',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=450&fit=crop',
    tag: '🛋️ Mega Clearance',
  },
];

export const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const active = slides[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 rounded-none md:rounded-sm shadow-sm">
      {/* Slide Content */}
      <div 
        className={`w-full min-h-[220px] sm:min-h-[280px] md:min-h-[340px] bg-gradient-to-r ${active.gradient} flex items-center transition-all duration-500`}
      >
        <div className="container mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 py-6">
          
          {/* Text Information */}
          <div className="text-white space-y-2 md:space-y-3 max-w-xl text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#ffe500] text-[#2874f0] text-xs md:text-sm font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              <Zap className="h-3.5 w-3.5 fill-[#2874f0]" />
              {active.badge}
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {active.title}
            </h2>

            <p className="text-sm md:text-base text-gray-100 font-medium">
              {active.subtitle}
            </p>

            <div className="bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-md inline-block text-xs md:text-sm font-bold text-yellow-300">
              {active.offer}
            </div>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
              <Link
                to={`/products?category=${active.category}`}
                className="bg-white text-gray-900 hover:bg-yellow-400 font-bold px-6 py-2 md:py-2.5 rounded text-sm transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
              >
                Grab Deal Now
              </Link>
              <span className="text-xs text-white/90 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-[#ffe500]" /> 100% Genuine Products
              </span>
            </div>
          </div>

          {/* Banner Graphic Image */}
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] aspect-[16/10] overflow-hidden rounded-lg shadow-2xl border-2 border-white/20 flex-shrink-0 group">
            <img
              src={active.imageUrl}
              alt={active.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded">
              {active.tag}
            </div>
          </div>

        </div>
      </div>

      {/* Prev / Next Arrows */}
      <button
        type="button"
        aria-label="Previous Slide"
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-r shadow-lg transition-all opacity-80 hover:opacity-100 hover:scale-110 hidden sm:flex items-center justify-center"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </button>

      <button
        type="button"
        aria-label="Next Slide"
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-l shadow-lg transition-all opacity-80 hover:opacity-100 hover:scale-110 hidden sm:flex items-center justify-center"
      >
        <ChevronRight className="h-6 w-6 text-gray-700" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-7 bg-[#ffe500]' : 'w-2 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
