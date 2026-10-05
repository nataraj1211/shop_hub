import { Trash2, Plus, Minus, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f1f3f6] py-12">
        <div className="text-center bg-white p-8 md:p-12 rounded-sm shadow-sm max-w-md w-full border border-gray-200">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2874f0]">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Your ShopHub Cart is empty!</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-2 mb-6">
            Explore our bestselling products and grab deals on electronics, fashion, and essentials.
          </p>
          <Link to="/products">
            <Button className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold px-8 h-10 rounded-sm shadow">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const total = getCartTotal();
  // Calculate original price total for realistic savings calculation
  const originalTotal = cart.reduce(
    (acc, item) => acc + (item.originalPrice || item.price * 1.3) * item.quantity,
    0
  );
  const totalSavings = Math.max(0, Math.floor(originalTotal - total));
  const delivery = total > 500 ? 0 : 40;
  const finalTotal = total + delivery;

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-4 md:py-8">
      <div className="container mx-auto px-2 md:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          
          {/* Left Column: Delivery Address & Cart Items (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            
            {/* Delivery Pincode Bar */}
            <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">Deliver to: </span>
                <span className="text-sm font-bold text-gray-800">Bengaluru - 560103</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[#2874f0] border-[#2874f0] text-xs font-bold hover:bg-blue-50 h-8"
                onClick={() => toast.info('Delivery location set to default address')}
              >
                Change
              </Button>
            </div>

            {/* Cart Items List */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm divide-y divide-gray-100">
              {cart.map((item) => {
                const itemOriginal = item.originalPrice || Math.floor(item.price * 1.3);
                const discountPct = item.discount || Math.round(((itemOriginal - item.price) / itemOriginal) * 100);

                return (
                  <div key={item.id} className="p-4 md:p-6 flex flex-col sm:flex-row gap-4">
                    {/* Item Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded border border-gray-100 p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link 
                            to={`/product/${item.id}`}
                            className="text-sm md:text-base font-semibold text-gray-900 hover:text-[#2874f0] transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          {/* Delivery estimate */}
                          <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:inline">
                            Delivery by Tomorrow | <span className="text-[#388e3c] font-semibold">FREE</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 capitalize">Seller: RetailNet</span>
                          <div className="inline-flex items-center gap-0.5 bg-[#2874f0]/10 text-[#2874f0] px-1 py-0.2 rounded text-[9px] font-black italic">
                            <span>f-Assured</span>
                            <span className="text-yellow-500 text-[10px]">✦</span>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{(itemOriginal * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-[#388e3c]">
                            {discountPct}% Off
                          </span>
                        </div>
                      </div>

                      {/* Quantity Selector & Action Links */}
                      <div className="flex items-center gap-4 mt-4 pt-2">
                        <div className="flex items-center gap-1 border border-gray-300 rounded">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 disabled:opacity-40 text-gray-600"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            removeFromCart(item.id);
                            toast.info(`${item.name} saved for later`);
                          }}
                          className="text-xs font-bold text-gray-700 hover:text-[#2874f0] uppercase tracking-wider transition-colors"
                        >
                          Save for Later
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider transition-colors"
                        >
                          Remove
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* Bottom Sticky Checkout Action Bar */}
              <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between sticky bottom-0 z-20 shadow-md">
                <div>
                  <p className="text-xs text-gray-500">Total Payable</p>
                  <p className="text-lg font-black text-gray-900">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="lg"
                    onClick={() => navigate('/checkout')}
                    className="bg-[#fb641b] hover:bg-[#e05414] text-white font-extrabold text-sm md:text-base px-6 md:px-8 h-11 rounded-sm shadow-md uppercase tracking-wider"
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Price Details (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 bg-white rounded-sm border border-gray-200 shadow-sm p-4 md:p-5 space-y-4">
              <h3 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-100">
                Price Details
              </h3>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Price ({cart.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span>₹{Math.floor(originalTotal).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-[#388e3c]">
                  <span>Discount</span>
                  <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-[#388e3c] font-semibold">
                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Secured Packaging Fee</span>
                  <span className="text-green-700 font-semibold">FREE</span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Savings Banner */}
              {totalSavings > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-sm text-xs font-semibold text-[#388e3c] text-center">
                  🎉 You will save ₹{totalSavings.toLocaleString('en-IN')} on this order
                </div>
              )}

              {/* Safe and Secure Payments Guarantee */}
              <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="leading-tight">
                  Safe and Secure Payments. 100% Authentic Products.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
