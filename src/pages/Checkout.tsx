import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Lock, 
  PackageCheck, 
  Truck, 
  ArrowRight, 
  ShoppingBag, 
  Copy, 
  Check, 
  Sparkles,
  Calendar,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { Order } from '@/types/product';
import { format } from 'date-fns';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || 'Nataraj',
    email: user?.email || 'nataraj@example.com',
    phone: '9876543210',
    address: 'No 42, 4th Cross, Koramangala 5th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
  });

  const total = getCartTotal();
  const originalTotal = cart.reduce(
    (acc, item) => acc + (item.originalPrice || item.price * 1.3) * item.quantity,
    0
  );
  const totalSavings = Math.max(0, Math.floor(originalTotal - total));
  const delivery = total > 500 ? 0 : 40;
  const finalTotal = total + delivery;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all required shipping fields');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = createOrder(
        cart,
        {
          fullName: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
        formData.email,
        paymentMethod
      );
      
      clearCart();
      setIsProcessing(false);
      setConfirmedOrder(newOrder);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  // -------------------------------------------------------------
  // Order Confirmation Success View (When Order is Confirmed)
  // -------------------------------------------------------------
  if (confirmedOrder) {
    const paymentLabel = 
      confirmedOrder.paymentMethod === 'cod' 
        ? 'Cash on Delivery (Pay upon arrival)' 
        : confirmedOrder.paymentMethod === 'card' 
        ? 'Credit / Debit Card (Online Paid)' 
        : 'UPI Instant Payment (Verified)';

    return (
      <div className="min-h-screen bg-[#f1f3f6] py-8 px-3 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-6">
          
          {/* Top Banner: Your Order is Confirmed */}
          <div className="bg-white rounded-md border border-green-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 md:p-8 text-white text-center relative">
              <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-full mb-3 ring-8 ring-white/10 animate-bounce">
                <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Your Order is Confirmed!
              </h1>
              <p className="text-green-100 text-sm md:text-base mt-2 max-w-xl mx-auto">
                Thank you for shopping on <span className="font-bold text-yellow-300">ShopHub</span>! Your order has been placed and is being prepared for shipment.
              </p>

              {/* Order ID Tag with Quick Copy */}
              <div className="mt-4 inline-flex items-center gap-2 bg-black/25 backdrop-blur-sm px-4 py-2 rounded-full text-xs md:text-sm font-mono border border-white/20">
                <span className="text-gray-200">Order ID:</span>
                <span className="font-bold text-yellow-300">{confirmedOrder.id}</span>
                <button 
                  onClick={() => handleCopyId(confirmedOrder.id)}
                  className="hover:text-white text-gray-300 p-0.5 ml-1 transition-colors"
                  title="Copy Order ID"
                >
                  {copiedId ? <Check className="h-3.5 w-3.5 text-green-300" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="p-4 md:p-6 bg-green-50/60 border-b border-green-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-700">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Estimated Delivery</p>
                  <p className="text-gray-900 font-bold">2 - 4 Business Days (Express)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-[#2874f0]">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Payment Method</p>
                  <p className="text-gray-900 font-bold">{paymentLabel}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100 text-amber-700">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Order Updates Sent To</p>
                  <p className="text-gray-900 font-bold truncate max-w-[200px]">{confirmedOrder.customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Live Progress Tracker */}
            <div className="p-6 md:p-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
                Order Delivery Tracker
              </h3>
              
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
                {/* Step 1 */}
                <div className="flex items-center md:flex-col gap-3 md:gap-2 text-left md:text-center z-10">
                  <div className="h-9 w-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-green-100 shadow">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-green-700">Order Confirmed</p>
                    <p className="text-[10px] text-gray-400">{format(new Date(confirmedOrder.createdAt), 'dd MMM, hh:mm a')}</p>
                  </div>
                </div>

                {/* Connector Line 1 */}
                <div className="hidden md:block flex-1 h-1 bg-green-500 mx-2 -mt-5" />

                {/* Step 2 */}
                <div className="flex items-center md:flex-col gap-3 md:gap-2 text-left md:text-center z-10">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-blue-100 shadow animate-pulse">
                    <PackageCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-700">Packing &amp; Processing</p>
                    <p className="text-[10px] text-gray-400">ShopHub Warehouse</p>
                  </div>
                </div>

                {/* Connector Line 2 */}
                <div className="hidden md:block flex-1 h-1 bg-gray-200 mx-2 -mt-5" />

                {/* Step 3 */}
                <div className="flex items-center md:flex-col gap-3 md:gap-2 text-left md:text-center z-10 opacity-70">
                  <div className="h-9 w-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs shadow">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Shipped</p>
                    <p className="text-[10px] text-gray-400">Express Courier</p>
                  </div>
                </div>

                {/* Connector Line 3 */}
                <div className="hidden md:block flex-1 h-1 bg-gray-200 mx-2 -mt-5" />

                {/* Step 4 */}
                <div className="flex items-center md:flex-col gap-3 md:gap-2 text-left md:text-center z-10 opacity-70">
                  <div className="h-9 w-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs shadow">
                    🏡
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Delivered</p>
                    <p className="text-[10px] text-gray-400">To Doorstep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address & Items Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Ordered Items */}
            <div className="md:col-span-2 bg-white rounded-md border border-gray-200 shadow-sm p-4 md:p-6">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center justify-between">
                <span>Items in this Order ({confirmedOrder.items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">Confirmed</span>
              </h3>

              <div className="divide-y divide-gray-100 mt-2">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center gap-3.5">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-16 w-16 object-cover rounded border border-gray-200 bg-gray-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Qty: <span className="font-bold text-gray-800">{item.quantity}</span>
                        {item.selectedSize && ` • Size: ${item.selectedSize}`}
                      </p>
                      <p className="text-xs font-bold text-gray-900 mt-1">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">Total Paid Amount:</span>
                <span className="text-lg font-extrabold text-[#2874f0]">
                  ₹{confirmedOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Right 1 Col: Shipping Details & Quick Links */}
            <div className="space-y-4">
              <div className="bg-white rounded-md border border-gray-200 shadow-sm p-4 md:p-5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#2874f0]" /> Delivery Address
                </h4>
                <div className="mt-3 text-xs text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900 text-sm">{confirmedOrder.shippingAddress.fullName}</p>
                  <p className="text-gray-600">{confirmedOrder.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} - <span className="font-bold">{confirmedOrder.shippingAddress.pincode}</span>
                  </p>
                  <p className="text-gray-600 pt-1 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-400" /> Phone: <span className="font-semibold text-gray-900">{confirmedOrder.shippingAddress.phone}</span>
                  </p>
                </div>
              </div>

              {/* Notice for Admin / Seller */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-xs">
                <div className="flex items-center gap-2 text-[#2874f0] font-bold mb-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Admin Notification</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  This order is now registered in the <strong>Admin Console</strong> as a <strong>New Order</strong> with status <span className="font-semibold text-blue-700">"Confirmed"</span>.
                </p>
              </div>
            </div>

          </div>

          {/* Action Navigation Buttons */}
          <div className="bg-white p-4 md:p-6 rounded-md border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto text-xs md:text-sm h-11 px-6 font-semibold"
            >
              Continue Shopping
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="w-full sm:w-auto text-xs md:text-sm h-11 px-5 font-bold border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                View in Admin Console (New Order)
              </Button>

              <Button
                onClick={() => navigate('/orders')}
                className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#e05414] text-white text-xs md:text-sm font-bold h-11 px-8 rounded-sm shadow uppercase tracking-wider"
              >
                View My Orders
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Default Checkout Form
  // -------------------------------------------------------------
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-6">
      <div className="container mx-auto px-2 md:px-6 max-w-6xl">
        
        {/* ShopHub Secure Checkout Header */}
        <div className="bg-[#2874f0] text-white p-4 rounded-t-sm shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight italic text-lg">Shop<span className="text-yellow-300 not-italic">Hub</span></span>
            <span className="text-yellow-300 text-xs font-semibold">Checkout</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-100 font-medium">
            <Lock className="h-3.5 w-3.5 text-yellow-300" /> 100% Safe &amp; Secure Payments
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3">
            
            {/* Left Steps Column (8 cols) */}
            <div className="lg:col-span-8 space-y-3">
              
              {/* Step 1: Delivery Address */}
              <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-4 md:p-6">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                  <span className="h-6 w-6 rounded bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 uppercase">
                    Delivery Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <Label htmlFor="name" className="text-xs text-gray-600 font-medium">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 h-9 rounded-sm" required />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs text-gray-600 font-medium">10-digit Mobile Number *</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="mt-1 h-9 rounded-sm" required />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs text-gray-600 font-medium">Email ID (for order invoice) *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-1 h-9 rounded-sm" required />
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="text-xs text-gray-600 font-medium">Pincode *</Label>
                    <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} className="mt-1 h-9 rounded-sm" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-xs text-gray-600 font-medium">Flat, House no., Building, Company, Apartment *</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className="mt-1 h-9 rounded-sm" required />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-xs text-gray-600 font-medium">City / District *</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} className="mt-1 h-9 rounded-sm" required />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-xs text-gray-600 font-medium">State *</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleInputChange} className="mt-1 h-9 rounded-sm" required />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Options */}
              <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-4 md:p-6">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                  <span className="h-6 w-6 rounded bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 uppercase">
                    Payment Method
                  </h3>
                </div>

                <div className="space-y-3">
                  <label 
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-between p-3.5 border rounded cursor-pointer transition-all ${
                      paymentMethod === 'upi' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-[#2874f0]' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'upi'} readOnly className="text-[#2874f0]" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-[#2874f0]" /> UPI (Google Pay / PhonePe / Paytm / BHIM)
                        </p>
                        <p className="text-xs text-gray-500">Fast &amp; Instant verification</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">FAST</span>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-3.5 border rounded cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-[#2874f0]' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'card'} readOnly className="text-[#2874f0]" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-[#2874f0]" /> Credit / Debit / ATM Card
                        </p>
                        <p className="text-xs text-gray-500">Visa, MasterCard, RuPay, Maestro</p>
                      </div>
                    </div>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-3.5 border rounded cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-[#2874f0]' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'cod'} readOnly className="text-[#2874f0]" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-[#388e3c]" /> Cash on Delivery (COD)
                        </p>
                        <p className="text-xs text-gray-500">Pay cash or UPI at your doorstep</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Order Confirmation will be sent to</p>
                  <p className="text-sm font-bold text-gray-800">{formData.email}</p>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing}
                  className="bg-[#fb641b] hover:bg-[#e05414] text-white font-extrabold text-sm md:text-base px-10 h-11 rounded-sm shadow-md uppercase tracking-wider"
                >
                  {isProcessing ? 'Confirming Order...' : 'Submit & Confirm Order'}
                </Button>
              </div>

            </div>

            {/* Right Price Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-20 bg-white rounded-sm border border-gray-200 shadow-sm p-4 md:p-5 space-y-4">
                <h3 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-100">
                  Price Details
                </h3>

                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Price ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
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

                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
                    <span>Total Payable</span>
                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {totalSavings > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-sm text-xs font-semibold text-[#388e3c] text-center">
                    🎉 You will save ₹{totalSavings.toLocaleString('en-IN')} on this order
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="leading-tight">
                    Safe and Secure Payments. Easy returns. 100% Authentic products.
                  </span>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Checkout;
