import { 
  Store, 
  HelpCircle, 
  Gift, 
  Sparkles, 
  ShieldCheck, 
  CreditCard,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#172337] text-white text-xs mt-12 border-t border-gray-800">
      {/* Upper Footer Links */}
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-gray-300">
          
          {/* Column 1: About */}
          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">
              About
            </h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline hover:text-white">Contact Us</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">About Us</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">Careers</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">ShopHub Stories</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">Press</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">Corporate Information</Link></li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">
              Help
            </h4>
            <ul className="space-y-2">
              <li><Link to="/orders" className="hover:underline hover:text-white">Payments</Link></li>
              <li><Link to="/orders" className="hover:underline hover:text-white">Shipping</Link></li>
              <li><Link to="/orders" className="hover:underline hover:text-white">Cancellation & Returns</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">FAQ</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">Report Infringement</Link></li>
            </ul>
          </div>

          {/* Column 3: Consumer Policy */}
          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">
              Consumer Policy
            </h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline hover:text-white">Cancellation & Returns</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">Terms Of Use</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">Security</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">Privacy</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">Sitemap</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">Grievance Redressal</Link></li>
              <li><Link to="/" className="hover:underline hover:text-white">EPR Compliance</Link></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div>
            <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3">
              Social
            </h4>
            <ul className="space-y-2">
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline hover:text-white">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline hover:text-white">Twitter (X)</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:underline hover:text-white">YouTube</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline hover:text-white">Instagram</a></li>
            </ul>
          </div>

          {/* Column 5: Mail Us */}
          <div className="border-t md:border-t-0 md:border-l border-gray-700 md:pl-6 col-span-2 md:col-span-1">
            <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-[#2874f0]" /> Mail Us:
            </h4>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              ShopHub Commerce Private Limited,<br />
              Buildings Alyssa, Begonia &amp;<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103, Karnataka, India
            </p>
          </div>

          {/* Column 6: Registered Office */}
          <div className="border-t md:border-t-0 md:border-l border-gray-700 md:pl-6 col-span-2 md:col-span-1">
            <h4 className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#2874f0]" /> Registered Office:
            </h4>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              ShopHub Commerce Private Limited,<br />
              Buildings Alyssa, Begonia &amp; Clove Embassy Tech Village,<br />
              Outer Ring Road,<br />
              Bengaluru, 560103, Karnataka, India<br />
              CIN : U51109KA2012PTC066107<br />
              Telephone: <span className="text-[#2874f0] font-semibold">044-45614700 / 044-67415800</span>
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Service Badges & Copyright */}
      <div className="border-t border-gray-700 py-6 bg-[#0f1724]">
        <div className="container mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-6 text-gray-300 text-xs font-semibold">
            <Link to="/admin" className="flex items-center gap-2 hover:text-[#ffe500] transition-colors">
              <Store className="h-4 w-4 text-[#ffe500]" />
              <span>Become a Seller</span>
            </Link>
            <Link to="/" className="flex items-center gap-2 hover:text-[#ffe500] transition-colors">
              <Sparkles className="h-4 w-4 text-[#ffe500]" />
              <span>Advertise</span>
            </Link>
            <Link to="/" className="flex items-center gap-2 hover:text-[#ffe500] transition-colors">
              <Gift className="h-4 w-4 text-[#ffe500]" />
              <span>Gift Cards</span>
            </Link>
            <Link to="/" className="flex items-center gap-2 hover:text-[#ffe500] transition-colors">
              <HelpCircle className="h-4 w-4 text-[#ffe500]" />
              <span>Help Center</span>
            </Link>
          </div>

          <div className="text-gray-400 text-xs">
            © 2024-2026 ShopHub.com · All rights reserved
          </div>

          {/* Payment Partner Badges */}
          <div className="flex items-center gap-2 text-gray-400 text-[11px]">
            <span className="font-semibold text-gray-300">100% Secure Payments:</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono font-bold">VISA</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono font-bold">Mastercard</span>
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono font-bold">RuPay</span>
            <span className="bg-gray-800 text-[#ffe500] px-2 py-0.5 rounded font-bold">UPI</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
