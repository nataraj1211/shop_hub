import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { X, Filter, SlidersHorizontal, Star, Check } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics & Mobiles' },
  { value: 'fashion', label: 'Fashion & Clothing' },
  { value: 'groceries', label: 'ShopHub Grocery' },
  { value: 'home', label: 'Home & Kitchen' },
];

const priceRanges = [
  { value: 'all', label: 'All Prices', min: 0, max: Infinity },
  { value: 'under500', label: 'Under ₹500', min: 0, max: 500 },
  { value: '500-2000', label: '₹500 - ₹2,000', min: 500, max: 2000 },
  { value: '2000-10000', label: '₹2,000 - ₹10,000', min: 2000, max: 10000 },
  { value: 'above10000', label: 'Above ₹10,000', min: 10000, max: Infinity },
];

type SortOption = 'relevance' | 'popularity' | 'priceLow' | 'priceHigh' | 'newest';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyAssured, setOnlyAssured] = useState(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (search !== null) setSearchQuery(search);
  }, [searchParams]);

  const priceRange = priceRanges.find((r) => r.value === selectedPriceRange) || priceRanges[0];

  const filteredProducts = useMemo(() => {
    let list = products.filter((product) => {
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
      const priceMatch = product.price >= priceRange.min && product.price < priceRange.max;
      const ratingMatch = minRating === 0 || product.rating >= minRating;
      const discountMatch = minDiscount === 0 || (product.discount || 0) >= minDiscount;
      const searchMatch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && priceMatch && ratingMatch && discountMatch && searchMatch;
    });

    // Sorting
    switch (sortBy) {
      case 'priceLow':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      case 'newest':
        list.reverse();
        break;
      default:
        break;
    }

    return list;
  }, [products, selectedCategory, priceRange, minRating, minDiscount, searchQuery, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newParams: Record<string, string> = {};
    if (category !== 'all') newParams.category = category;
    if (searchQuery.trim()) newParams.search = searchQuery.trim();
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setMinRating(0);
    setOnlyAssured(false);
    setMinDiscount(0);
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-4">
      <div className="container mx-auto px-2 md:px-6">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>›</span>
          <span className="text-gray-800 font-semibold capitalize">
            {selectedCategory === 'all' ? 'All Products' : selectedCategory}
          </span>
          {searchQuery && (
            <span className="text-gray-500">for "{searchQuery}"</span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Filters Sidebar (3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-4 space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-[#2874f0]" /> Filters
                </h3>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-[#2874f0] hover:underline uppercase"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Category
                </h4>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`w-full text-left text-xs py-1 px-2 rounded transition-colors ${
                        selectedCategory === cat.value
                          ? 'bg-blue-50 text-[#2874f0] font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Price
                </h4>
                <div className="space-y-1.5">
                  {priceRanges.map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-black py-0.5"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range.value}
                        onChange={() => setSelectedPriceRange(range.value)}
                        className="text-[#2874f0] focus:ring-[#2874f0]"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Ratings Filter */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Customer Ratings
                </h4>
                <div className="space-y-1.5">
                  {[4, 3].map((star) => (
                    <label
                      key={star}
                      className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-black py-0.5"
                    >
                      <input
                        type="radio"
                        name="ratingFilter"
                        checked={minRating === star}
                        onChange={() => setMinRating(minRating === star ? 0 : star)}
                        className="text-[#2874f0] focus:ring-[#2874f0]"
                      />
                      <span className="flex items-center gap-1">
                        {star}★ &amp; above
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Discount Filter */}
              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Discount
                </h4>
                <div className="space-y-1.5">
                  {[50, 30, 20].map((disc) => (
                    <label
                      key={disc}
                      className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-black py-0.5"
                    >
                      <input
                        type="radio"
                        name="discountFilter"
                        checked={minDiscount === disc}
                        onChange={() => setMinDiscount(minDiscount === disc ? 0 : disc)}
                        className="text-[#2874f0] focus:ring-[#2874f0]"
                      />
                      <span>{disc}% or more</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Assured Filter */}
              <div className="border-t border-gray-100 pt-3">
                <label className="flex items-center gap-2 text-xs text-gray-800 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyAssured}
                    onChange={(e) => setOnlyAssured(e.target.checked)}
                    className="rounded text-[#2874f0]"
                  />
                  <span className="inline-flex items-center gap-0.5 text-[#2874f0] italic">
                    ShopHub Assured <span className="text-yellow-500 not-italic">✦</span>
                  </span>
                </label>
              </div>

            </div>
          </div>

          {/* Right Product Grid Area (9 cols) */}
          <div className="lg:col-span-9 space-y-3">
            
            {/* Sort Bar (Flipkart Style Tabs) */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                <span className="font-bold text-gray-900">{filteredProducts.length}</span> items found
              </div>

              <div className="flex items-center gap-2 text-xs overflow-x-auto">
                <span className="font-bold text-gray-700 mr-1">Sort By:</span>
                
                <button
                  type="button"
                  onClick={() => setSortBy('relevance')}
                  className={`px-3 py-1 font-semibold rounded-sm transition-colors ${
                    sortBy === 'relevance'
                      ? 'border-b-2 border-[#2874f0] text-[#2874f0] font-bold'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Relevance
                </button>

                <button
                  type="button"
                  onClick={() => setSortBy('popularity')}
                  className={`px-3 py-1 font-semibold rounded-sm transition-colors ${
                    sortBy === 'popularity'
                      ? 'border-b-2 border-[#2874f0] text-[#2874f0] font-bold'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Popularity
                </button>

                <button
                  type="button"
                  onClick={() => setSortBy('priceLow')}
                  className={`px-3 py-1 font-semibold rounded-sm transition-colors ${
                    sortBy === 'priceLow'
                      ? 'border-b-2 border-[#2874f0] text-[#2874f0] font-bold'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Price -- Low to High
                </button>

                <button
                  type="button"
                  onClick={() => setSortBy('priceHigh')}
                  className={`px-3 py-1 font-semibold rounded-sm transition-colors ${
                    sortBy === 'priceHigh'
                      ? 'border-b-2 border-[#2874f0] text-[#2874f0] font-bold'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Price -- High to Low
                </button>

                <button
                  type="button"
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-1 font-semibold rounded-sm transition-colors ${
                    sortBy === 'newest'
                      ? 'border-b-2 border-[#2874f0] text-[#2874f0] font-bold'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Newest First
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-sm border border-gray-200 p-12 text-center">
                <p className="text-lg font-bold text-gray-800">No products found matching your filters.</p>
                <p className="text-xs text-gray-500 mt-1 mb-4">Try clearing filters or changing your search terms.</p>
                <Button 
                  onClick={handleClearFilters}
                  className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Products;
