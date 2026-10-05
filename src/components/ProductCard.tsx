import { useState } from 'react';
import { Star, ShoppingCart, Zap, Heart, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success(`${product.name} added to your Wishlist!`);
    } else {
      toast.info(`${product.name} removed from your Wishlist`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added! Proceeding to checkout...`);
    navigate('/checkout');
  };

  return (
    <div className="group bg-white rounded-sm border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative p-3">
      {/* Wishlist Heart Button */}
      <button
        type="button"
        aria-label="Add to wishlist"
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Heart 
          className={`h-4 w-4 transition-colors ${
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
          }`} 
        />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="w-full aspect-square overflow-hidden bg-gray-50 flex items-center justify-center rounded p-2">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
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
        </div>
      </Link>

      {/* Product Details */}
      <div className="pt-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Flipkart Assured Pill */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              {product.category}
            </span>
            {/* Assured Badge */}
            <div className="inline-flex items-center gap-0.5 bg-[#2874f0]/10 text-[#2874f0] px-1.5 py-0.5 rounded text-[10px] font-extrabold italic">
              <span>Assured</span>
              <span className="text-yellow-500 not-italic text-[11px]">✦</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#2874f0] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating Badge */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="inline-flex items-center gap-1 bg-[#388e3c] text-white px-1.5 py-0.5 rounded text-[11px] font-bold">
              <span>{product.rating}</span>
              <Star className="h-2.5 w-2.5 fill-white" />
            </div>
            <span className="text-[11px] text-gray-500 font-medium">
              ({product.reviews?.toLocaleString('en-IN') || 450})
            </span>
          </div>

          {/* Price & Discounts */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-base md:text-lg font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.discount && (
              <span className="text-xs font-bold text-[#388e3c]">
                {product.discount}% off
              </span>
            )}
          </div>

          {/* Flipkart Free Delivery Tag */}
          <p className="text-[11px] text-gray-500 mt-1">
            <span className="font-semibold text-gray-700">Free delivery</span> · Daily Saver Deal
          </p>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
          <Button
            type="button"
            size="sm"
            onClick={handleAddToCart}
            className="bg-[#ff9f00] hover:bg-[#e68e00] text-white font-bold text-xs h-8 rounded-sm shadow-sm transition-all"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Add to Cart
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleBuyNow}
            className="bg-[#fb641b] hover:bg-[#e05414] text-white font-bold text-xs h-8 rounded-sm shadow-sm transition-all"
          >
            <Zap className="h-3.5 w-3.5 mr-1 fill-white" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};
