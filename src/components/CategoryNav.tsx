import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface CategoryItem {
  name: string;
  category: string;
  image: string;
  hasDropdown?: boolean;
}

const categories: CategoryItem[] = [
  {
    name: 'Top Offers',
    category: 'all',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=128&h=128&fit=crop',
  },
  {
    name: 'Mobiles',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=128&h=128&fit=crop',
  },
  {
    name: 'Electronics',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=128&h=128&fit=crop',
    hasDropdown: true,
  },
  {
    name: 'Fashion',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=128&h=128&fit=crop',
    hasDropdown: true,
  },
  {
    name: 'Grocery',
    category: 'groceries',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=128&h=128&fit=crop',
  },
  {
    name: 'Home & Kitchen',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=128&h=128&fit=crop',
    hasDropdown: true,
  },
  {
    name: 'Appliances',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=128&h=128&fit=crop',
  },
  {
    name: 'Beauty & Toys',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=128&h=128&fit=crop',
  },
  {
    name: 'Travel',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=128&h=128&fit=crop',
  },
];

export const CategoryNav = () => {
  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-2 lg:px-6">
        <div className="flex items-center justify-between overflow-x-auto py-3 gap-3 md:gap-6 no-scrollbar">
          {categories.map((item) => (
            <Link
              key={item.name}
              to={item.category === 'all' ? '/products' : `/products?category=${item.category}`}
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer min-w-[68px] md:min-w-[80px]"
            >
              <div className="h-14 w-14 md:h-16 md:w-16 flex items-center justify-center p-1 rounded-full group-hover:scale-105 transition-transform duration-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    // Fallback to stylized high-res e-commerce placeholder if external CDN is blocked
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop`;
                  }}
                />
              </div>
              <span className="text-[11px] md:text-[13px] font-semibold text-gray-800 group-hover:text-[#2874f0] transition-colors mt-1 text-center flex items-center gap-0.5 whitespace-nowrap">
                {item.name}
                {item.hasDropdown && (
                  <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-[#2874f0] group-hover:rotate-180 transition-transform duration-200" />
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
