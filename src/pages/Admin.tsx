import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Package, 
  ShoppingBag, 
  Edit, 
  Save, 
  TrendingUp, 
  DollarSign, 
  Bell, 
  Eye, 
  CheckCircle2, 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  CreditCard,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Product, Order } from '@/types/product';
import { format } from 'date-fns';

const statusBadgeStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300 font-semibold',
  shipped: 'bg-purple-100 text-purple-800 border-purple-300',
  delivered: 'bg-green-100 text-green-800 border-green-300 font-semibold',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
};

const Admin = () => {
  const { isAuthenticated, isAdmin, login } = useAuth();
  const { products, updateProduct, updateStock } = useProducts();
  const { getAllOrders, updateOrderStatus, markOrderAsSeen } = useOrders();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
  });

  // Sort orders newest first
  const allOrders = getAllOrders();
  const sortedOrders = [...allOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const newOrders = sortedOrders.filter((o) => o.isNew || o.status === 'confirmed');

  const filteredOrders = sortedOrders.filter((order) => {
    if (orderFilter === 'new') return order.isNew || order.status === 'confirmed';
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  const stats = {
    totalProducts: products.length,
    totalOrders: sortedOrders.length,
    newOrdersCount: newOrders.length,
    totalRevenue: sortedOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0),
    lowStock: products.filter((p) => p.stock < 20).length,
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: editForm.name,
        price: editForm.price,
        stock: editForm.stock,
        description: editForm.description,
        inStock: editForm.stock > 0,
      });
      setEditingProduct(null);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    updateStock(productId, newStock);
  };

  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus, isNew: false });
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    if (order.isNew) {
      markOrderAsSeen(order.id);
    }
  };

  // Quick Login as Demo Admin if not logged in
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#f1f3f6]">
        <Card className="max-w-md w-full shadow-lg border-blue-200">
          <CardHeader className="text-center bg-blue-50/50 pb-4 border-b">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#2874f0] text-white flex items-center justify-center shadow mb-2">
              <ShieldCheck className="h-6 w-6 text-yellow-300" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">Admin Console Access</CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              Please sign in with administrator privileges to manage products and orders.
            </p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="bg-gray-50 p-3 rounded border text-xs text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">Administrator Credentials:</p>
              <p>Email: <span className="font-mono font-bold text-[#2874f0]">admin@shophub.com</span></p>
              <p>Password: <span className="font-mono font-bold text-[#2874f0]">admin123</span></p>
            </div>
            <Button
              onClick={() => login('admin@shophub.com', 'admin123', 'admin')}
              className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-bold h-10 shadow"
            >
              One-Click Login as Admin
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full text-xs h-9"
            >
              Go to Standard Login Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 bg-[#f1f3f6]">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        
        {/* Admin Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-md border border-gray-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Admin Management Console
              </h1>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-bold text-xs">
                Seller / Admin
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Real-time monitoring of live customer orders, inventory levels, and order fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs font-semibold"
            >
              View Storefront
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab('orders');
                setOrderFilter('new');
              }}
              className="text-xs font-bold bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
            >
              <Flame className="h-3.5 w-3.5 mr-1 text-amber-600" />
              {stats.newOrdersCount} New Orders
            </Button>
          </div>
        </div>

        {/* Live Alert Banner for New Orders */}
        {stats.newOrdersCount > 0 && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 rounded-md shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full animate-bounce">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-extrabold text-sm md:text-base flex items-center gap-2">
                  <span>🔔 New Customer Order Alert!</span>
                  <span className="bg-white text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {stats.newOrdersCount} NEW
                  </span>
                </p>
                <p className="text-xs text-orange-100 mt-0.5">
                  You have {stats.newOrdersCount} new confirmed order(s) waiting for packaging and dispatch.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setActiveTab('orders');
                setOrderFilter('new');
              }}
              className="bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs h-9 px-4 shadow whitespace-nowrap"
            >
              View New Orders Now →
            </Button>
          </div>
        )}

        {/* 4 Primary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: New Orders (Highlighted) */}
          <Card className={`border-2 transition-all ${stats.newOrdersCount > 0 ? 'border-amber-400 bg-amber-50/40 shadow-md ring-2 ring-amber-100' : 'border-gray-200'}`}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-amber-600" /> New Orders
                  </p>
                  <p className="text-3xl font-black text-gray-900 mt-1">
                    {stats.newOrdersCount}
                  </p>
                  <p className="text-[11px] text-amber-700 mt-1 font-medium">
                    {stats.newOrdersCount > 0 ? 'Requires fulfillment action' : 'All orders processed'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Flame className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Total Orders */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{stats.totalOrders}</p>
                  <p className="text-[11px] text-gray-400 mt-1">All time lifetime orders</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 text-[#2874f0] flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Total Revenue */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-green-600 mt-1 font-medium">From fulfilled/confirmed orders</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Total Products */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Products</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{stats.totalProducts}</p>
                  <p className="text-[11px] text-orange-600 mt-1 font-medium">{stats.lowStock} Low stock alert</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Package className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'orders' | 'products')} className="space-y-4">
          <TabsList className="bg-white p-1 rounded-md border shadow-sm">
            <TabsTrigger 
              value="orders" 
              className="text-xs font-bold data-[state=active]:bg-[#2874f0] data-[state=active]:text-white px-5 py-2"
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
              Orders Management ({stats.totalOrders})
              {stats.newOrdersCount > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                  {stats.newOrdersCount} NEW
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="text-xs font-bold data-[state=active]:bg-[#2874f0] data-[state=active]:text-white px-5 py-2"
            >
              <Package className="h-3.5 w-3.5 mr-1.5" />
              Products Management ({stats.totalProducts})
            </TabsTrigger>
          </TabsList>

          {/* -------------------------------------------------------------
              TAB 1: ORDERS MANAGEMENT
             ------------------------------------------------------------- */}
          <TabsContent value="orders" className="space-y-4">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3 border-b flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span>Customer Orders</span>
                    <Badge variant="outline" className="text-xs font-mono font-normal">
                      {filteredOrders.length} order(s)
                    </Badge>
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Newly placed orders appear here in real-time marked with the <strong className="text-amber-600">NEW ORDER</strong> badge.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button
                    size="sm"
                    variant={orderFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setOrderFilter('all')}
                    className={`text-xs h-8 px-3 rounded-full ${orderFilter === 'all' ? 'bg-[#2874f0]' : ''}`}
                  >
                    All ({sortedOrders.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={orderFilter === 'new' ? 'default' : 'outline'}
                    onClick={() => setOrderFilter('new')}
                    className={`text-xs h-8 px-3 rounded-full font-bold ${
                      orderFilter === 'new' 
                        ? 'bg-amber-600 text-white hover:bg-amber-700' 
                        : 'text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100'
                    }`}
                  >
                    🔥 New Orders ({stats.newOrdersCount})
                  </Button>
                  <Button
                    size="sm"
                    variant={orderFilter === 'confirmed' ? 'default' : 'outline'}
                    onClick={() => setOrderFilter('confirmed')}
                    className={`text-xs h-8 px-3 rounded-full ${orderFilter === 'confirmed' ? 'bg-blue-600' : ''}`}
                  >
                    Confirmed
                  </Button>
                  <Button
                    size="sm"
                    variant={orderFilter === 'shipped' ? 'default' : 'outline'}
                    onClick={() => setOrderFilter('shipped')}
                    className={`text-xs h-8 px-3 rounded-full ${orderFilter === 'shipped' ? 'bg-purple-600' : ''}`}
                  >
                    Shipped
                  </Button>
                  <Button
                    size="sm"
                    variant={orderFilter === 'delivered' ? 'default' : 'outline'}
                    onClick={() => setOrderFilter('delivered')}
                    className={`text-xs h-8 px-3 rounded-full ${orderFilter === 'delivered' ? 'bg-green-600' : ''}`}
                  >
                    Delivered
                  </Button>
                  <Button
                    size="sm"
                    variant={orderFilter === 'cancelled' ? 'default' : 'outline'}
                    onClick={() => setOrderFilter('cancelled')}
                    className={`text-xs h-8 px-3 rounded-full ${orderFilter === 'cancelled' ? 'bg-red-600' : ''}`}
                  >
                    Cancelled
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-base font-bold text-gray-700">No orders found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {orderFilter === 'new' 
                        ? 'All new incoming orders have been processed! Place an order on the storefront to test.' 
                        : 'No orders match this filter.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50/80">
                        <TableRow>
                          <TableHead className="font-bold text-xs uppercase text-gray-600">Order ID &amp; Badge</TableHead>
                          <TableHead className="font-bold text-xs uppercase text-gray-600">Customer</TableHead>
                          <TableHead className="font-bold text-xs uppercase text-gray-600">Items</TableHead>
                          <TableHead className="font-bold text-xs uppercase text-gray-600">Total</TableHead>
                          <TableHead className="font-bold text-xs uppercase text-gray-600">Payment</TableHead>
                          <TableHead className="font-bold text-xs uppercase text-gray-600">Date &amp; Time</TableHead>
                          <TableHead className="font-bold text-xs uppercase text-gray-600">Status</TableHead>
                          <TableHead className="font-bold text-xs uppercase text-gray-600 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => {
                          const isNewOrder = order.isNew || order.status === 'confirmed';

                          return (
                            <TableRow 
                              key={order.id} 
                              className={`transition-colors ${isNewOrder ? 'bg-amber-50/50 hover:bg-amber-100/50' : 'hover:bg-gray-50'}`}
                            >
                              {/* Order ID + NEW ORDER Badge */}
                              <TableCell className="font-mono text-xs font-bold">
                                <div className="space-y-1">
                                  <div className="text-gray-900">{order.id}</div>
                                  {isNewOrder && (
                                    <div className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm tracking-wide animate-pulse">
                                      <Flame className="h-3 w-3" /> NEW ORDER
                                    </div>
                                  )}
                                </div>
                              </TableCell>

                              {/* Customer info */}
                              <TableCell className="text-xs">
                                <div className="font-bold text-gray-900">{order.shippingAddress.fullName}</div>
                                <div className="text-gray-500 text-[11px] truncate max-w-[150px]">{order.customerEmail}</div>
                                <div className="text-gray-400 text-[10px]">{order.shippingAddress.phone}</div>
                              </TableCell>

                              {/* Items summary */}
                              <TableCell className="text-xs">
                                <div className="font-medium text-gray-800">
                                  {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                                </div>
                                <div className="text-[11px] text-gray-400 truncate max-w-[160px]">
                                  {order.items.map((i) => i.name).join(', ')}
                                </div>
                              </TableCell>

                              {/* Total */}
                              <TableCell className="text-xs font-bold text-gray-900">
                                ₹{order.total.toLocaleString('en-IN')}
                              </TableCell>

                              {/* Payment method */}
                              <TableCell className="text-xs">
                                <span className="font-semibold text-gray-700 uppercase text-[11px] bg-gray-100 px-1.5 py-0.5 rounded">
                                  {order.paymentMethod || 'UPI'}
                                </span>
                              </TableCell>

                              {/* Date */}
                              <TableCell className="text-xs text-gray-600 whitespace-nowrap">
                                <div>{format(new Date(order.createdAt), 'dd MMM yyyy')}</div>
                                <div className="text-[10px] text-gray-400">{format(new Date(order.createdAt), 'hh:mm a')}</div>
                              </TableCell>

                              {/* Status Badge */}
                              <TableCell>
                                <span className={`text-[11px] px-2 py-0.5 rounded border capitalize ${statusBadgeStyles[order.status] || ''}`}>
                                  {order.status}
                                </span>
                              </TableCell>

                              {/* Actions */}
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewOrder(order)}
                                    className="h-8 text-xs px-2.5 hover:bg-blue-50 text-blue-700 border-blue-200"
                                    title="View Full Order Details"
                                  >
                                    <Eye className="h-3.5 w-3.5 mr-1" />
                                    Details
                                  </Button>

                                  <Select
                                    value={order.status}
                                    onValueChange={(val) => handleOrderStatusChange(order.id, val as Order['status'])}
                                  >
                                    <SelectTrigger className="w-28 h-8 text-xs font-medium">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* -------------------------------------------------------------
              TAB 2: PRODUCTS MANAGEMENT
             ------------------------------------------------------------- */}
          <TabsContent value="products">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3 border-b flex justify-between items-center">
                <CardTitle className="text-base font-bold text-gray-900">
                  Store Inventory &amp; Catalog
                </CardTitle>
                <Badge variant="outline" className="text-xs">{products.length} Items</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50/80">
                      <TableRow>
                        <TableHead className="text-xs uppercase font-bold text-gray-600">Product</TableHead>
                        <TableHead className="text-xs uppercase font-bold text-gray-600">Category</TableHead>
                        <TableHead className="text-xs uppercase font-bold text-gray-600">Price (₹)</TableHead>
                        <TableHead className="text-xs uppercase font-bold text-gray-600">Inventory Stock</TableHead>
                        <TableHead className="text-xs uppercase font-bold text-gray-600">Availability</TableHead>
                        <TableHead className="text-xs uppercase font-bold text-gray-600 text-right">Edit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded border bg-gray-100 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-semibold text-xs md:text-sm text-gray-900 block truncate max-w-[200px]">
                                  {product.name}
                                </span>
                                <span className="text-[11px] text-gray-400">ID: {product.id}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize text-xs text-gray-600">{product.category}</TableCell>
                          <TableCell className="text-xs font-bold text-gray-900">
                            ₹{product.price.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={product.stock}
                              onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                              className="w-20 h-8 text-xs rounded-sm"
                              min={0}
                            />
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={product.stock > 20 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}
                              className="text-[10px]"
                            >
                              {product.stock > 20 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditProduct(product)}
                              className="h-8 text-xs"
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>

      {/* -------------------------------------------------------------
          MODAL 1: VIEW ORDER DETAILS DIALOG
         ------------------------------------------------------------- */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center justify-between gap-2">
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <span>Order Details:</span>
                    <span className="font-mono text-[#2874f0]">{selectedOrder.id}</span>
                  </DialogTitle>
                  {(selectedOrder.isNew || selectedOrder.status === 'confirmed') && (
                    <Badge className="bg-amber-500 text-white font-extrabold text-xs">
                      🔥 NEW ORDER
                    </Badge>
                  )}
                </div>
                <DialogDescription className="text-xs text-gray-500">
                  Placed on {format(new Date(selectedOrder.createdAt), 'PPP p')}
                </DialogDescription>
              </DialogHeader>

              {/* Status Update Quick Bar */}
              <div className="bg-blue-50/70 p-3.5 rounded border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-gray-700 block">Current Order Status:</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${statusBadgeStyles[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-gray-600 font-medium">Update Status:</span>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val) => handleOrderStatusChange(selectedOrder.id, val as Order['status'])}
                  >
                    <SelectTrigger className="w-36 h-9 text-xs bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Shipping Address & Customer Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded border space-y-1">
                  <p className="font-bold text-gray-800 flex items-center gap-1.5 uppercase text-[11px] text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-[#2874f0]" /> Delivery Address
                  </p>
                  <p className="font-bold text-gray-900 text-sm">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-gray-600">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded border space-y-2">
                  <p className="font-bold text-gray-800 uppercase text-[11px] text-gray-500">
                    Customer Information
                  </p>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <span className="font-medium">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span className="font-semibold text-gray-900">{selectedOrder.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                    <span>Payment: <strong className="uppercase">{selectedOrder.paymentMethod || 'UPI'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ordered Items ({selectedOrder.items.reduce((s, i) => s + i.quantity, 0)})
                </h4>
                <div className="divide-y divide-gray-200 border rounded-md overflow-hidden bg-white">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-12 w-12 rounded object-cover border bg-gray-50"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-gray-500">
                            Qty: <strong className="text-gray-800">{item.quantity}</strong>
                            {item.selectedSize && ` • Size: ${item.selectedSize}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-gray-400">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-gray-50 flex justify-between items-center font-bold text-sm text-gray-900">
                    <span>Grand Total:</span>
                    <span className="text-[#2874f0]">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------
          MODAL 2: EDIT PRODUCT DIALOG
         ------------------------------------------------------------- */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Product Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Price (₹)</Label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Stock Quantity</Label>
                <Input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Input
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
            <Button onClick={handleSaveProduct} className="w-full bg-[#2874f0] hover:bg-blue-700 text-white font-bold h-10 mt-2">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Admin;
