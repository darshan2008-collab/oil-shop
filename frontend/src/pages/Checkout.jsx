import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, User, Phone, MapPin, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod'
  });
  const [loading, setLoading] = useState(false);
  const [showOnlineUnavailable, setShowOnlineUnavailable] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const buildWhatsAppMessage = (order) => {
    const itemsList = cart.map(item => 
      `  • ${item.name} × ${item.quantity}L = ₹${item.price * item.quantity}`
    ).join('\n');

    const message = `🛒 *New Order #${order.id} — Vinayaka Oils*

👤 *Customer Details*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}

📦 *Delivery Address*
${formData.address}
${formData.city}, ${formData.state} - ${formData.zipCode}

🧴 *Ordered Products*
${itemsList}

💰 *Total Amount: ₹${cartTotal}*
💳 Payment: ${formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}

📅 Date: ${new Date().toLocaleString('en-IN')}`;

    return encodeURIComponent(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      customer: formData,
      items: cart,
      total: cartTotal
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();

        // Send order details to WhatsApp
        const whatsappMessage = buildWhatsAppMessage(order);
        const whatsappURL = `https://wa.me/919566119003?text=${whatsappMessage}`;
        window.open(whatsappURL, '_blank');

        clearCart();
        navigate(`/order-success/${order.id}`);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-10 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary mb-6">Your cart is empty</h1>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primaryDark transition shadow-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center space-x-2 mb-6 sm:mb-8">
          <button 
            onClick={() => navigate('/cart')} 
            className="p-2 bg-white rounded-full border hover:bg-gray-50 transition"
            aria-label="Back to Cart"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-primary">Checkout</h1>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 shadow-sm">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-serif text-primary flex items-center border-b pb-2 border-gray-100">
                  <User className="w-5 h-5 mr-2 text-accent" />
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                      placeholder="e.g. Aditi Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                      placeholder="aditi@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                        placeholder="+91 95661 19003"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-serif text-primary flex items-center border-b pb-2 border-gray-100">
                  <MapPin className="w-5 h-5 mr-2 text-accent" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                      placeholder="Door No., Street Name, Locality"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                        placeholder="Karur"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                        placeholder="Tamil Nadu"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                        placeholder="639005"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold font-serif text-primary flex items-center border-b pb-2 border-gray-100">
                  <CreditCard className="w-5 h-5 mr-2 text-accent" />
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition duration-300 ${
                    formData.paymentMethod === 'cod'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-700 hover:border-primary/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="mr-3 text-primary focus:ring-primary border-gray-300"
                    />
                    <div className="text-left">
                      <p className="font-bold text-sm">Cash on Delivery</p>
                      <p className="text-xs opacity-80 mt-0.5">Pay when you receive the order</p>
                    </div>
                  </label>
                  
                  <div 
                    onClick={() => setShowOnlineUnavailable(true)}
                    className="flex items-center p-4 border rounded-xl cursor-not-allowed transition duration-300 border-gray-200 bg-gray-50 text-gray-400 relative"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      disabled
                      className="mr-3 border-gray-300 opacity-40"
                    />
                    <div className="text-left">
                      <p className="font-bold text-sm text-gray-400">Online UPI / Card</p>
                      <p className="text-xs text-gray-400 mt-0.5">Currently unavailable</p>
                    </div>
                  </div>
                </div>

                {showOnlineUnavailable && (
                  <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-xl p-3 animate-pulse">
                    <span className="text-red-500 text-lg">⚠️</span>
                    <div className="flex-grow">
                      <p className="text-red-700 text-sm font-semibold">This payment method is currently unavailable</p>
                      <p className="text-red-500 text-xs mt-0.5">Please select Cash on Delivery to proceed.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowOnlineUnavailable(false)} 
                      className="text-red-400 hover:text-red-600 text-xs font-bold px-2"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primaryDark text-white py-4 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md"
              >
                <Truck className="w-5 h-5 text-accent animate-bounce" />
                <span>{loading ? 'Processing Order...' : 'Place Order Now'}</span>
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 sticky top-24 shadow-sm space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold font-serif text-gray-800 border-b pb-3 border-gray-100">Order Summary</h2>
              
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-sm">
                    <div className="w-12 h-12 bg-[#fcfaf5] rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100/50 p-1">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600 uppercase">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-md font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-extrabold text-primary">₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
