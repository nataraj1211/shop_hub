import { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  User, 
  LogOut, 
  Package, 
  ShieldCheck, 
  X, 
  ChevronDown, 
  Heart, 
  Gift, 
  Bell, 
  Headphones, 
  TrendingUp, 
  Download,
  Store,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export const Header = () => {
  const { getCartCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { newOrdersCount } = useOrders();
  const { products } = useProducts();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const matchingProducts = searchQuery.trim()
    ? products
        .filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#2874f0] text-white shadow-md">
      {/* Top Flipkart Blue Strip */}
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu + Flipkart Logo */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile Drawer Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button 
                type="button" 
                aria-label="Open navigation menu"
                className="md:hidden text-white p-1 hover:bg-white/10 rounded"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 bg-white text-gray-800">
              <SheetHeader className="bg-[#2874f0] text-white p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-white text-base font-semibold">
                      {isAuthenticated ? `Hello, ${user?.name}` : 'Welcome Guest'}
                    </SheetTitle>
                    {!isAuthenticated && (
                      <Link 
                        to="/login" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xs text-[#ffe500] font-medium hover:underline"
                      >
                        Login / Sign Up
                      </Link>
                    )}
                  </div>
                </div>
              </SheetHeader>
              <div className="py-2 overflow-y-auto max-h-[calc(100vh-100px)]">
                <div className="px-4 py-2 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                  Top Categories
                </div>
                <Link
                  to="/products?category=electronics"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-2.5 hover:bg-blue-50 text-sm font-medium"
                >
                  📱 Mobiles & Electronics
                </Link>
                <Link
                  to="/products?category=fashion"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-2.5 hover:bg-blue-50 text-sm font-medium"
                >
                  👗 Fashion & Lifestyle
                </Link>
                <Link
                  to="/products?category=groceries"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-2.5 hover:bg-blue-50 text-sm font-medium"
                >
                  🛒 ShopHub Grocery
                </Link>
                <Link
                  to="/products?category=home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-2.5 hover:bg-blue-50 text-sm font-medium"
                >
                  🛋️ Home & Furniture
                </Link>

                <div className="border-t my-2" />
                <div className="px-4 py-2 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                  ShopHub Services
                </div>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-sm"
                >
                  <Package className="h-4 w-4 text-[#2874f0]" /> My Orders
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 text-sm"
                >
                  <ShoppingCart className="h-4 w-4 text-[#2874f0]" /> My Cart ({cartCount})
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 text-sm text-purple-700 font-medium"
                  >
                    <span className="flex items-center gap-3">
                      <ShieldCheck className="h-4 w-4" /> Admin Console
                    </span>
                    {newOrdersCount > 0 && (
                      <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {newOrdersCount} New
                      </span>
                    )}
                  </Link>
                )}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 text-left"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* ShopHub Brand Logo */}
          <Link to="/" className="flex flex-col items-start leading-none group">
            <span className="text-xl md:text-2xl font-bold tracking-tight italic text-white flex items-center gap-0.5">
              Shop<span className="text-yellow-400 not-italic">Hub</span>
              <span className="text-yellow-400 not-italic text-sm font-black ml-0.5 animate-pulse">✦</span>
            </span>
            <span className="text-[10px] md:text-[11px] font-medium text-gray-200 italic flex items-center gap-1 group-hover:text-white transition-colors">
              Explore <span className="text-[#ffe500] font-bold">Plus</span>
              <Sparkles className="h-2.5 w-2.5 text-[#ffe500] fill-[#ffe500]" />
            </span>
          </Link>
        </div>

        {/* Center: Flipkart Wide Search Bar */}
        <div className="flex-1 max-w-2xl relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="text"
              placeholder="Search for Products, Brands and More"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 pl-4 pr-12 py-2 rounded-sm border-0 focus-visible:ring-2 focus-visible:ring-yellow-400 shadow-sm text-sm h-9 md:h-10"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search query"
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-0 top-0 bottom-0 px-3 text-[#2874f0] hover:text-blue-700 flex items-center justify-center transition-colors"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </form>

          {/* Instant Search Suggestions Dropdown */}
          {showSuggestions && matchingProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-800 rounded-sm shadow-2xl z-50 border border-gray-200 overflow-hidden animate-in fade-in-50 duration-150">
              <div className="p-2 bg-gray-50 border-b text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                <span>Products matching "{searchQuery}"</span>
                <span className="text-blue-600 font-normal">Press Enter to view all</span>
              </div>
              <div className="max-h-[350px] overflow-y-auto divide-y divide-gray-100">
                {matchingProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSuggestionClick(product.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50/70 text-left transition-colors group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-11 w-11 rounded object-cover border bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#2874f0]">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-gray-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.discount && (
                          <span className="text-[11px] font-semibold text-green-600">
                            {product.discount}% off
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 capitalize">
                          in {product.category}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-2.5 bg-blue-50/50 text-center border-t">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="text-xs font-semibold text-[#2874f0] hover:underline inline-flex items-center gap-1"
                >
                  See all matching results for "{searchQuery}" →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2 md:gap-6">
          
          {/* Flipkart Style Login Button / User Profile */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 font-semibold text-sm px-3 py-1.5 rounded hover:bg-white/10 transition-colors text-white focus:outline-none">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="h-3 w-3 opacity-80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1 bg-white text-gray-800 shadow-xl border border-gray-100 rounded-sm">
                <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-sm mb-1">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-[#2874f0] font-medium mt-0.5">ShopHub Plus Member ✦</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer py-2 text-sm font-medium hover:bg-blue-50">
                  <Package className="h-4 w-4 mr-2.5 text-[#2874f0]" />
                  Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/products')} className="cursor-pointer py-2 text-sm font-medium hover:bg-blue-50">
                  <Heart className="h-4 w-4 mr-2.5 text-pink-500" />
                  Wishlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/cart')} className="cursor-pointer py-2 text-sm font-medium hover:bg-blue-50">
                  <Gift className="h-4 w-4 mr-2.5 text-amber-500" />
                  Rewards & Coupons
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer py-2 text-sm font-bold text-purple-700 hover:bg-purple-50 justify-between">
                      <div className="flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2.5" />
                        Admin Dashboard
                      </div>
                      {newOrdersCount > 0 && (
                        <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {newOrdersCount} New
                        </span>
                      )}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2.5" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button 
                variant="outline" 
                className="bg-white text-[#2874f0] font-bold text-sm px-6 h-8 rounded-sm hover:bg-slate-50 border-0 shadow-sm"
              >
                Login
              </Button>
            </Link>
          )}

          {/* Become a Seller / Admin */}
          <Link 
            to="/admin" 
            className="hidden lg:flex items-center gap-1.5 text-sm font-semibold hover:text-[#ffe500] transition-colors whitespace-nowrap"
            title="Become a Seller / Admin Console"
          >
            <Store className="h-4 w-4 text-[#ffe500]" />
            <span>Seller / Admin</span>
            {newOrdersCount > 0 && (
              <span className="bg-amber-400 text-gray-900 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                {newOrdersCount} New
              </span>
            )}
          </Link>

          {/* More Options Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden md:flex items-center gap-1 text-sm font-semibold hover:text-[#ffe500] transition-colors px-1 focus:outline-none">
                <span>More</span>
                <ChevronDown className="h-3 w-3 opacity-80" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1 bg-white text-gray-800 shadow-xl border border-gray-100 rounded-sm">
              <DropdownMenuItem className="cursor-pointer py-2 text-sm font-medium hover:bg-blue-50">
                <Bell className="h-4 w-4 mr-2.5 text-[#2874f0]" />
                Notification Preferences
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 text-sm font-medium hover:bg-blue-50">
                <Headphones className="h-4 w-4 mr-2.5 text-[#2874f0]" />
                24x7 Customer Care
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 text-sm font-medium hover:bg-blue-50">
                <TrendingUp className="h-4 w-4 mr-2.5 text-[#2874f0]" />
                Advertise on ShopHub
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 text-sm font-medium hover:bg-blue-50">
                <Download className="h-4 w-4 mr-2.5 text-[#2874f0]" />
                Download App
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Flipkart Cart Button with Counter */}
          <Link 
            to="/cart" 
            className="flex items-center gap-2 font-semibold text-sm hover:text-[#ffe500] transition-colors py-1 px-2 rounded"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5 md:h-5 md:w-5" />
              {cartCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2.5 h-4 min-w-[16px] px-1 flex items-center justify-center text-[10px] font-bold bg-[#ffe500] text-[#2874f0] border border-[#2874f0] rounded-full p-0 leading-none"
                >
                  {cartCount}
                </Badge>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>

        </div>

      </div>
    </header>
  );
};
