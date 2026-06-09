import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo & Mobile Menu Group */}
            <div className="flex items-center">
              {/* Mobile Menu Button (on the left) */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-50 rounded-full transition duration-300 mr-2"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <img 
                    src="/images/logo.png" 
                    alt="Vinayaka Oils Logo" 
                    className="w-10 h-10 object-contain transform group-hover:scale-105 transition duration-300" 
                  />
                  <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-110 transition duration-300 -z-10"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold font-serif text-primary leading-tight tracking-wide">Vinayaka</h1>
                  <p className="text-[10px] tracking-widest text-accent font-bold uppercase leading-none">Pure Cooking Oils</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-1 text-sm font-medium transition duration-300 ${
                    isActive(link.path)
                      ? 'text-primary font-semibold'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <button className="hidden sm:block p-2 hover:bg-gray-50 rounded-full transition duration-300" aria-label="Search">
                <Search className="w-5 h-5 text-gray-700 hover:text-primary transition" />
              </button>
              
              <Link to="/admin" className="hidden sm:block p-2 hover:bg-gray-50 rounded-full transition duration-300" aria-label="Admin Dashboard">
                <User className="w-5 h-5 text-gray-700 hover:text-primary transition" />
              </Link>
              
              <Link to="/cart" className="p-2 hover:bg-gray-50 rounded-full transition duration-300 relative" aria-label="Cart">
                <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-primary transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden sm:flex items-center space-x-2 border-l border-gray-200 pl-3 ml-1">
                  <div className="flex flex-col text-right">
                    <span className="text-[11px] font-semibold text-gray-800 leading-none">Hi, {user.username}</span>
                    <button
                      onClick={logout}
                      className="text-[9px] text-accent hover:text-primary transition font-bold uppercase tracking-wider text-left mt-0.5"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2 border-l border-gray-200 pl-3 ml-1">
                  <Link
                    to="/login"
                    className="text-xs text-primary hover:text-primaryDark transition font-bold uppercase tracking-wider pl-1"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Overlay and Menu) */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      
      <div 
        className={`fixed top-0 left-0 z-50 w-3/4 max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col transition-transform duration-300 ease-in-out transform md:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="Vinayaka Oils Logo" className="w-8 h-8 object-contain" />
            <span className="font-serif font-bold text-lg text-primary">Vinayaka Oils</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-1 hover:bg-gray-50 rounded-full transition"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-grow overflow-y-auto scrollbar-none py-6">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`py-2 text-base font-medium border-b border-gray-50 transition duration-300 ${
                  isActive(link.path)
                    ? 'text-primary font-bold'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Fixed Bottom Buttons Area */}
        <div className="mt-auto pt-6 border-t border-gray-100 space-y-3 flex-shrink-0">
          {user ? (
            <div className="bg-cream border border-gray-100 p-4 rounded-xl flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-800">{user.username}</span>
                  <span className="text-[10px] text-gray-400">Standard User</span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="text-xs text-red-600 hover:text-red-800 transition font-bold"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center border border-primary text-primary hover:bg-primary/5 py-2.5 rounded-full font-semibold text-sm transition mb-2"
            >
              Sign In
            </Link>
          )}
          <Link 
            to="/shop" 
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-center bg-primary hover:bg-primaryDark text-white py-3.5 rounded-full font-semibold transition shadow-md"
          >
            Shop Now
          </Link>
          <Link 
            to="/admin" 
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-center border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-full font-medium text-sm transition"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
