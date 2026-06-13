import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-10 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-md">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-creamDark/50 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-gray-100">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-8 font-light">Add some of our pure, natural cooking oils to get started!</p>
          <Link
            to="/shop"
            className="inline-block bg-primary hover:bg-primaryDark text-white px-8 py-3 rounded-full font-semibold transition shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-primary mb-6 sm:mb-8 border-b border-gray-200/50 pb-4">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition duration-300 gap-3"
              >
                {/* Product Image & Details */}
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#fcfaf5] rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100/50 p-1">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="font-bold font-serif text-sm sm:text-lg text-gray-800 truncate">{item.name}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block truncate">{item.description}</p>
                    <p className="text-primary font-bold text-xs sm:text-md">₹{item.price} / L</p>
                    
                    {/* Quantity Selector for Mobile */}
                    <div className="flex items-center space-x-2 pt-1 sm:hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-50 border rounded-full flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-50 border rounded-full flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Prices for Desktop */}
                <div className="flex items-center space-x-4 sm:space-x-6 flex-shrink-0">
                  {/* Quantity Selector for Desktop */}
                  <div className="hidden sm:flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-full flex items-center justify-center transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 rounded-full flex items-center justify-center transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="text-right min-w-[60px] sm:min-w-[80px]">
                    <p className="text-sm sm:text-lg font-extrabold text-primary">₹{item.price * item.quantity}</p>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 sm:p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
 
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 sticky top-24 shadow-sm space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold font-serif text-gray-800 border-b pb-3 border-gray-100">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-amber-600">Calculated at checkout</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-extrabold text-primary">₹{cartTotal}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  to="/checkout"
                  className="w-full bg-primary hover:bg-primaryDark text-white py-3.5 rounded-xl font-semibold transition flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-accent" />
                </Link>

                <Link
                  to="/shop"
                  className="block w-full text-center py-2 text-sm text-gray-500 hover:text-primary transition font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
