import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types/product';
import { User, ShieldCheck, Sparkles, Lock, ArrowRight } from 'lucide-react';

type Mode = 'login' | 'signup';

const Login = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<UserRole>('customer');
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = mode === 'login'
      ? login(email, password, activeTab)
      : signup(name, email, password, activeTab);
    if (ok) {
      navigate(activeTab === 'admin' ? '/admin' : '/');
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setName('');
    setPassword('');
  };

  const renderForm = (role: UserRole) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <div className="space-y-1">
          <Label htmlFor={`${role}-name`} className="text-xs text-gray-600 font-semibold">
            Full Name
          </Label>
          <Input
            id={`${role}-name`}
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 text-sm border-gray-300 rounded-sm focus-visible:ring-[#2874f0]"
            required
          />
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor={`${role}-email`} className="text-xs text-gray-600 font-semibold">
          Email Address
        </Label>
        <Input
          id={`${role}-email`}
          type="email"
          placeholder={role === 'admin' ? 'admin@shophub.com' : 'Enter Email/Mobile number'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 text-sm border-gray-300 rounded-sm focus-visible:ring-[#2874f0]"
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={`${role}-password`} className="text-xs text-gray-600 font-semibold">
          Password
        </Label>
        <Input
          id={`${role}-password`}
          type="password"
          placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter Password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-10 text-sm border-gray-300 rounded-sm focus-visible:ring-[#2874f0]"
          required
        />
      </div>

      <p className="text-[11px] text-gray-500 leading-tight">
        By continuing, you agree to ShopHub's <span className="text-[#2874f0] font-medium cursor-pointer">Terms of Use</span> and <span className="text-[#2874f0] font-medium cursor-pointer">Privacy Policy</span>.
      </p>

      {/* Vibrant Orange Action Button */}
      <Button 
        type="submit" 
        className="w-full bg-[#fb641b] hover:bg-[#e05414] text-white font-extrabold h-11 rounded-sm shadow uppercase text-sm tracking-wider"
      >
        {mode === 'login'
          ? `Login as ${role === 'admin' ? 'Seller/Admin' : 'Customer'}`
          : `Continue with ${role === 'admin' ? 'Seller' : 'Customer'} Sign Up`}
      </Button>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-center text-xs font-bold text-[#2874f0] hover:bg-blue-50 py-2.5 border border-gray-200 rounded-sm shadow-sm transition-colors"
        >
          {mode === 'login' ? 'New to ShopHub? Create an account' : 'Existing User? Log in'}
        </button>
      </div>

      {mode === 'login' && (
        <div className="text-xs text-gray-600 mt-4 p-3 bg-blue-50/60 border border-blue-100 rounded-sm">
          <p className="font-bold text-[#2874f0] mb-1">Quick Demo Credentials:</p>
          {role === 'admin' ? (
            <div className="space-y-0.5 text-[11px]">
              <p>Email: <span className="font-mono font-semibold">admin@shophub.com</span></p>
              <p>Password: <span className="font-mono font-semibold">admin123</span></p>
            </div>
          ) : (
            <div className="space-y-0.5 text-[11px]">
              <p>Email: <span className="font-mono font-semibold">customer@example.com</span></p>
              <p>Password: <span className="font-mono font-semibold">customer123</span></p>
            </div>
          )}
        </div>
      )}
    </form>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 bg-[#f1f3f6]">
      <div className="w-full max-w-3xl bg-white rounded-sm border border-gray-200 shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Signature Left Blue Panel */}
        <div className="w-full md:w-[40%] bg-[#2874f0] p-8 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              {mode === 'login' ? 'Login' : 'Looks like you\'re new here!'}
            </h2>
            <p className="text-xs md:text-sm text-blue-100 mt-3 leading-relaxed">
              {mode === 'login'
                ? 'Get access to your Orders, Wishlist and Personalized Recommendations'
                : 'Sign up with your details to get started with incredible savings'}
            </p>
          </div>

          <div className="hidden md:flex flex-col items-center mt-12">
            <div className="h-28 w-28 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Sparkles className="h-14 w-14 text-[#ffe500]" />
            </div>
            <p className="text-xs text-yellow-300 font-bold mt-4 flex items-center gap-1">
              Explore <span className="text-white">ShopHub Plus ✦</span>
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 p-6 md:p-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded">
              <TabsTrigger value="customer" className="text-xs font-bold data-[state=active]:bg-[#2874f0] data-[state=active]:text-white">
                <User className="h-3.5 w-3.5 mr-1.5" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="admin" className="text-xs font-bold data-[state=active]:bg-[#2874f0] data-[state=active]:text-white">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                Seller / Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer">{renderForm('customer')}</TabsContent>
            <TabsContent value="admin">{renderForm('admin')}</TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  );
};

export default Login;
