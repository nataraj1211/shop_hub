import { CategoryNav } from '@/components/CategoryNav';
import { BannerCarousel } from '@/components/BannerCarousel';
import { DealsSection } from '@/components/DealsSection';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Sparkles,
  ChevronRight,
  Award
} from 'lucide-react';

const Home = () => {
  // Categorize products for different rails
  const electronicsProducts = products.filter((p) => p.category === 'electronics');
  const fashionProducts = products.filter((p) => p.category === 'fashion');
  const groceryProducts = products.filter((p) => p.category === 'groceries');
  const homeProducts = products.filter((p) => p.category === 'home');
  const dealOfTheDayProducts = products.filter((p) => (p.discount || 0) >= 30);
  const trendingProducts = products.slice(0, 12);

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-12">
      {/* 1. Category Icon Strip */}
      <CategoryNav />

      <div className="container mx-auto px-2 md:px-4 mt-2 space-y-4">
        
        {/* 2. Hero Banner Carousel */}
        <BannerCarousel />

        {/* 3. Deal of the Day with Countdown Timer & Bank Banner */}
        <DealsSection
          title="Deal of the Day"
          subtitle="Top Rated Brands & Crazy Discounts"
          products={dealOfTheDayProducts}
          categorySlug="all"
          hasTimer={true}
          showPromoBanner={true}
        />

        {/* 4. Super Saver Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            to="/products?category=electronics"
            className="group relative overflow-hidden rounded-sm bg-gradient-to-r from-blue-900 to-indigo-800 p-5 text-white shadow-sm flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase bg-yellow-400 text-blue-900 px-2 py-0.5 rounded">
                Smart Tech
              </span>
              <h4 className="text-lg font-bold mt-1.5 group-hover:text-yellow-300 transition-colors">
                Laptops &amp; Tablets
              </h4>
              <p className="text-xs text-blue-100">From ₹19,999 | No Cost EMI</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=150&fit=crop"
              alt="Laptops"
              className="w-20 h-20 object-cover rounded-md shadow transform group-hover:scale-105 transition-transform"
            />
          </Link>

          <Link
            to="/products?category=fashion"
            className="group relative overflow-hidden rounded-sm bg-gradient-to-r from-rose-900 to-pink-800 p-5 text-white shadow-sm flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase bg-yellow-400 text-rose-900 px-2 py-0.5 rounded">
                Special Carnival
              </span>
              <h4 className="text-lg font-bold mt-1.5 group-hover:text-yellow-300 transition-colors">
                Footwear &amp; Apparel
              </h4>
              <p className="text-xs text-pink-100">Min. 60% Off on Top Brands</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=150&fit=crop"
              alt="Footwear"
              className="w-20 h-20 object-cover rounded-md shadow transform group-hover:scale-105 transition-transform"
            />
          </Link>

          <Link
            to="/products?category=groceries"
            className="group relative overflow-hidden rounded-sm bg-gradient-to-r from-emerald-900 to-teal-800 p-5 text-white shadow-sm flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase bg-yellow-400 text-emerald-900 px-2 py-0.5 rounded">
                Supermart Deals
              </span>
              <h4 className="text-lg font-bold mt-1.5 group-hover:text-yellow-300 transition-colors">
                Daily Grocery Store
              </h4>
              <p className="text-xs text-emerald-100">Deals Starting ₹1 | Express Delivery</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=150&fit=crop"
              alt="Grocery"
              className="w-20 h-20 object-cover rounded-md shadow transform group-hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* 5. Best of Electronics Rail */}
        <DealsSection
          title="Best of Electronics"
          subtitle="Audio, Monitors, Wearables & Accessories"
          products={electronicsProducts}
          categorySlug="electronics"
          hasTimer={false}
          showPromoBanner={false}
        />

        {/* 6. Top Fashion Deals Rail */}
        <DealsSection
          title="Trending in Fashion"
          subtitle="T-Shirts, Dresses, Watches & Accessories"
          products={fashionProducts}
          categorySlug="fashion"
          hasTimer={false}
          showPromoBanner={false}
        />

        {/* 7. ShopHub Assured & Trust Bar */}
        <div className="bg-white rounded-sm border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="flex flex-col items-center pt-3 md:pt-0">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-[#2874f0] mb-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h5 className="text-sm font-bold text-gray-900">100% Authentic</h5>
              <p className="text-xs text-gray-500 mt-0.5">Directly from verified brands</p>
            </div>

            <div className="flex flex-col items-center pt-3 md:pt-0">
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-2">
                <RotateCcw className="h-6 w-6" />
              </div>
              <h5 className="text-sm font-bold text-gray-900">Easy 7-Day Returns</h5>
              <p className="text-xs text-gray-500 mt-0.5">Hassle-free replacement policy</p>
            </div>

            <div className="flex flex-col items-center pt-3 md:pt-0">
              <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center text-amber-600 mb-2">
                <Truck className="h-6 w-6" />
              </div>
              <h5 className="text-sm font-bold text-gray-900">ShopHub Fast Delivery</h5>
              <p className="text-xs text-gray-500 mt-0.5">On millions of eligible items</p>
            </div>

            <div className="flex flex-col items-center pt-3 md:pt-0">
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-2">
                <CreditCard className="h-6 w-6" />
              </div>
              <h5 className="text-sm font-bold text-gray-900">Secure Payments</h5>
              <p className="text-xs text-gray-500 mt-0.5">UPI, Cards, NetBanking &amp; COD</p>
            </div>
          </div>
        </div>

        {/* 8. Trending Recommended Products Grid */}
        <div className="bg-white rounded-sm border border-gray-200 p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Suggested for You</h3>
              <p className="text-xs text-gray-500">Based on popular items across categories</p>
            </div>
            <Link
              to="/products"
              className="text-[#2874f0] hover:underline text-xs md:text-sm font-bold inline-flex items-center gap-1"
            >
              Explore All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
