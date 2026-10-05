import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Zap, 
  ArrowLeft, 
  ShieldCheck, 
  Tag, 
  Truck, 
  MapPin, 
  Check, 
  RotateCcw,
  Heart,
  Share2,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find((p) => p.id === id);

  const [pincode, setPincode] = useState('560103');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f1f3f6]">
        <div className="text-center bg-white p-8 rounded-sm shadow-sm max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">The item you are looking for is currently unavailable or doesn't exist.</p>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold"
          >
            Back to ShopHub Home
          </Button>
        </div>
      </div>
    );
  }

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setPincodeChecked(true);
      toast.success(`Delivery available to pincode ${pincode}!`);
    } else {
      toast.error('Please enter a valid 6-digit pincode');
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    toast.success(`${product.name} added! Proceeding to checkout...`);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-4">
      <div className="container mx-auto px-2 md:px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 overflow-x-auto">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>›</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-[#2874f0] capitalize">
            {product.category}
          </Link>
          <span>›</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Card Container */}
        <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Gallery & Action Buttons (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="sticky top-20">
                
                {/* Main Product Showcase Image */}
                <div className="relative aspect-square w-full rounded border border-gray-200 bg-white flex items-center justify-center p-4 overflow-hidden group">
                  <button
                    type="button"
                    aria-label="Add to wishlist"
                    onClick={() => {
                      setIsWishlisted(!isWishlisted);
                      toast(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
                    }}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow border border-gray-200 text-gray-400 hover:text-red-500"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-300"
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

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="bg-[#ff9f00] hover:bg-[#e68e00] text-white font-extrabold text-sm md:text-base h-12 rounded-sm shadow-md uppercase tracking-wider"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="bg-[#fb641b] hover:bg-[#e05414] text-white font-extrabold text-sm md:text-base h-12 rounded-sm shadow-md uppercase tracking-wider flex items-center justify-center gap-1"
                    title="Buy Now with Express Delivery"
                  >
                    <Zap className="h-5 w-5 mr-1 fill-white" />
                    Buy Now
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-[#2874f0]" /> 1 Year Warranty
                  </span>
                  <span className="flex items-center gap-1">
                    <RotateCcw className="h-4 w-4 text-green-600" /> 7 Days Replacement
                  </span>
                </div>

              </div>
            </div>

            {/* Right Column: Details, Offers & Specs (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Product Header & f-Assured */}
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mt-2">
                  <div className="inline-flex items-center gap-1 bg-[#388e3c] text-white px-2 py-0.5 rounded text-xs font-bold">
                    <span>{product.rating}</span>
                    <Star className="h-3 w-3 fill-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {product.reviews?.toLocaleString('en-IN') || 850} Ratings &amp; 140 Reviews
                  </span>
                  {/* Assured Badge */}
                  <div className="inline-flex items-center gap-1 bg-[#2874f0]/10 text-[#2874f0] px-2 py-0.5 rounded text-xs font-black italic">
                    <span>Assured</span>
                    <span className="text-yellow-500 not-italic">✦</span>
                  </div>
                </div>
              </div>

              {/* Price & Discounts */}
              <div className="bg-gray-50/70 p-3 rounded-sm border border-gray-100">
                <span className="text-xs font-bold text-[#388e3c] uppercase">Special Price</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-base font-bold text-[#388e3c]">
                      {product.discount}% off
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <p className="text-xs text-[#388e3c] font-semibold mt-1">
                    You save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} with this deal!
                  </p>
                )}
              </div>

              {/* Available Offers */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-[#388e3c]" /> Available Offers
                </h3>
                <div className="space-y-1.5 text-xs text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-[#388e3c] font-bold text-sm leading-none">•</span>
                    <p><strong className="font-semibold text-gray-900">Bank Offer:</strong> 5% Unlimited Cashback on ShopHub Axis Bank Credit Card. <span className="text-[#2874f0] font-semibold cursor-pointer">T&amp;C</span></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#388e3c] font-bold text-sm leading-none">•</span>
                    <p><strong className="font-semibold text-gray-900">Special Price:</strong> Get extra 15% off (price inclusive of cashback/coupon). <span className="text-[#2874f0] font-semibold cursor-pointer">T&amp;C</span></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#388e3c] font-bold text-sm leading-none">•</span>
                    <p><strong className="font-semibold text-gray-900">Partner Offer:</strong> Sign up for ShopHub Pay Later &amp; get ₹500 Gift Card*. <span className="text-[#2874f0] font-semibold cursor-pointer">Know More</span></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#388e3c] font-bold text-sm leading-none">•</span>
                    <p><strong className="font-semibold text-gray-900">No Cost EMI:</strong> Avail No Cost EMI on select HDFC and ICICI cards. <span className="text-[#2874f0] font-semibold cursor-pointer">View Plans</span></p>
                  </div>
                </div>
              </div>

              {/* Delivery PinCode Checker */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-600">Deliver to:</span>
                  <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                    <div className="relative">
                      <MapPin className="h-4 w-4 text-[#2874f0] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value);
                          setPincodeChecked(false);
                        }}
                        className="pl-8 h-8 w-36 text-xs font-semibold"
                        placeholder="Enter Pincode"
                      />
                    </div>
                    <button
                      type="submit"
                      className="text-xs font-bold text-[#2874f0] hover:underline px-2"
                    >
                      Check
                    </button>
                  </form>
                </div>

                <div className="mt-2 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                    <Truck className="h-4 w-4 text-[#388e3c]" />
                    <span>Delivery by Tomorrow, 5 PM | <span className="text-[#388e3c]">FREE</span></span>
                  </div>
                  <p className="text-gray-500 pl-6 text-[11px]">
                    Cash on Delivery available on this order
                  </p>
                </div>
              </div>

              {/* Product Description */}
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-1">Product Description</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications Table */}
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Specifications</h3>
                <div className="border border-gray-200 rounded text-xs divide-y divide-gray-100">
                  <div className="grid grid-cols-3 p-2 bg-gray-50">
                    <span className="text-gray-500">In The Box</span>
                    <span className="col-span-2 text-gray-800 font-medium">1 Unit, User Manual, Warranty Card</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="text-gray-500">Model Name</span>
                    <span className="col-span-2 text-gray-800 font-medium">{product.name}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 bg-gray-50">
                    <span className="text-gray-500">Category</span>
                    <span className="col-span-2 text-gray-800 font-medium capitalize">{product.category}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="text-gray-500">Warranty</span>
                    <span className="col-span-2 text-gray-800 font-medium">1 Year Brand Domestic Warranty</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 bg-gray-50">
                    <span className="text-gray-500">Stock Availability</span>
                    <span className="col-span-2 font-bold text-[#388e3c]">
                      {product.inStock ? 'In Stock (Ready to dispatch)' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
