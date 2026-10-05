import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  XCircle, 
  CheckCircle2, 
  Truck, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

const statusBadgeStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300 font-bold',
  shipped: 'bg-purple-100 text-purple-800 border-purple-300 font-medium',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
};

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const { getOrdersByEmail, getAllOrders, cancelOrder } = useOrders();
  const navigate = useNavigate();

  const allOrders = getAllOrders();
  const userOrders = user ? getOrdersByEmail(user.email) : [];
  
  // Show user's orders if available; otherwise show all session orders placed on this device
  const displayOrders = userOrders.length > 0 ? userOrders : allOrders;

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
  };

  return (
    <div className="min-h-screen py-8 bg-[#f1f3f6]">
      <div className="container max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-md border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              My Orders &amp; Invoices
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Track shipments, review confirmed orders, and view delivery details.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate('/products')}
              className="text-xs font-semibold"
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="text-xs font-bold text-purple-700 border-purple-200 hover:bg-purple-50"
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              Admin Console
            </Button>
          </div>
        </div>

        {/* Guest Banner if viewing without login */}
        {!isAuthenticated && displayOrders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-md text-xs flex items-center justify-between gap-3">
            <p className="text-gray-700">
              Showing <strong className="text-blue-700">{displayOrders.length} order(s)</strong> placed on this device. Sign in to link orders to your account.
            </p>
            <Button
              size="sm"
              onClick={() => navigate('/login')}
              className="bg-[#2874f0] text-white hover:bg-blue-700 text-xs h-8 px-3 font-semibold"
            >
              Sign In
            </Button>
          </div>
        )}

        {/* Orders Listing */}
        {displayOrders.length === 0 ? (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-bold text-gray-800">No orders placed yet</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Explore our catalog and place your first order. Your order will immediately appear here as confirmed!
              </p>
              <Button 
                className="mt-6 bg-[#2874f0] hover:bg-blue-700 text-white font-bold px-8 shadow"
                onClick={() => navigate('/products')}
              >
                Start Shopping Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayOrders.map((order) => {
              const isConfirmed = order.status === 'confirmed';

              return (
                <Card key={order.id} className="border-gray-200 shadow-sm overflow-hidden bg-white">
                  
                  {/* Order Card Header */}
                  <CardHeader className="bg-gray-50/70 p-4 border-b flex flex-row items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Order ID:</span>
                        <CardTitle className="text-sm md:text-base font-mono font-bold text-gray-900">
                          {order.id}
                        </CardTitle>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Placed on {format(new Date(order.createdAt), 'dd MMMM yyyy, hh:mm a')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 ${statusBadgeStyles[order.status]}`}>
                        {isConfirmed && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                        {order.status === 'shipped' && <Truck className="h-3 w-3 text-purple-600" />}
                        {order.status === 'confirmed' ? 'Your Order Confirmed' : order.status.toUpperCase()}
                      </span>

                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-medium px-2"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  {/* Order Items */}
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item, index) => (
                        <div key={index} className="py-3 flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 md:w-16 md:h-16 object-cover rounded border border-gray-100 bg-gray-50 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Qty: <strong className="text-gray-800">{item.quantity}</strong>
                              {item.selectedSize && ` • Size: ${item.selectedSize}`}
                            </p>
                            <p className="text-xs font-bold text-gray-900 mt-1">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Payment Details Footer */}
                    <div className="border-t border-dashed border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1 text-gray-600">
                        <p className="font-bold text-gray-800 flex items-center gap-1.5 uppercase text-[11px] text-gray-500">
                          <MapPin className="h-3.5 w-3.5 text-[#2874f0]" /> Delivery Address
                        </p>
                        <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p className="pt-0.5 text-gray-500">Contact: {order.shippingAddress.phone}</p>
                      </div>

                      <div className="flex flex-col md:items-end justify-between space-y-2">
                        <div className="md:text-right">
                          <p className="text-[11px] text-gray-400 uppercase tracking-wider">Payment Method</p>
                          <p className="font-bold text-gray-800 uppercase flex items-center md:justify-end gap-1 mt-0.5">
                            <CreditCard className="h-3.5 w-3.5 text-gray-500" />
                            {order.paymentMethod || 'UPI Instant'}
                          </p>
                        </div>
                        <div className="md:text-right">
                          <p className="text-[11px] text-gray-400 uppercase tracking-wider">Total Amount Paid</p>
                          <p className="text-xl font-extrabold text-[#2874f0]">
                            ₹{order.total.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
