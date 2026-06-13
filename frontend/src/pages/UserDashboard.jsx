import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, ShoppingBag, Star, Package, TrendingUp, Clock,
  CheckCircle, XCircle, Loader, ChevronRight, LogOut,
  MapPin, Phone, Calendar, Award, Heart, Droplets, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'bg-amber-100 text-amber-700 border-amber-200',   icon: Clock },
  confirmed:  { label: 'Confirmed',  color: 'bg-teal-100 text-teal-700 border-teal-200',     icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700 border-blue-200',      icon: Loader },
  shipped:    { label: 'Shipped',    color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Package },
  delivered:  { label: 'Delivered',  color: 'bg-green-100 text-green-700 border-green-200',   icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-700 border-red-200',         icon: XCircle },
};

const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition duration-300 flex items-center space-x-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const OrderTimeline = ({ currentStatus }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', desc: 'We have received your order' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Order confirmed & shipping charge set' },
    { key: 'processing', label: 'Processing', desc: 'Preparing your premium oils' },
    { key: 'shipped', label: 'Shipped', desc: 'Your package is on the way' },
    { key: 'delivered', label: 'Delivered', desc: 'Delivered to your doorstep' }
  ];

  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2 animate-bounce" />
        <h4 className="font-bold text-red-800 text-sm">Order Cancelled</h4>
        <p className="text-xs text-red-600 mt-1">This order has been cancelled and will not be processed.</p>
      </div>
    );
  }

  const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Tracking Status</h4>
      <div className="relative pl-6 space-y-6 border-l-2 border-gray-200 ml-2.5">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex || currentStatus === 'delivered';
          const isActive = index === currentIndex && currentStatus !== 'delivered';
          
          return (
            <div key={step.key} className="relative">
              {/* Indicator Dot */}
              <div className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 transition-all duration-300 ${
                isCompleted 
                  ? 'bg-primary border-primary text-white'
                  : isActive
                  ? 'bg-accent border-accent text-white animate-pulse'
                  : 'bg-white border-gray-300'
              }`}>
                {isCompleted && '✓'}
                {isActive && '•'}
              </div>
              <div>
                <p className={`text-sm font-semibold transition-colors duration-300 ${isCompleted || isActive ? 'text-primary' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderDetailModal = ({ order, onClose, onCancelOrder }) => {
  if (!order) return null;
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  
  const subtotal = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || order.subtotal || order.total || 0;
  const shipping = order.shippingCharge !== null && order.shippingCharge !== undefined ? order.shippingCharge : null;
  const total = shipping !== null ? subtotal + shipping : subtotal;
  
  const deliveryAddress = order.customer?.address || order.address;
  const deliveryCity = order.customer?.city || (order.address?.city || '');
  const deliveryState = order.customer?.state || (order.address?.state || '');
  const deliveryZip = order.customer?.zipCode || (order.address?.zipCode || '');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-serif text-primary">Order #{order.id} Details & Tracking</h3>
            <p className="text-xs text-gray-400 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-semibold rounded-xl text-xs transition"
          >
            Close
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Timeline */}
          <OrderTimeline currentStatus={order.status} />

          {/* Delivery & Payment Details */}
          <div className="bg-[#fcfaf5] border border-gray-200/50 rounded-xl p-5 space-y-3">
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b pb-1 border-gray-200/30">Delivery Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Recipient</p>
                <p className="font-semibold text-gray-800">{order.customer?.name || order.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="font-semibold text-gray-800">{order.customer?.phone || order.phone || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Shipping Address</p>
                <p className="font-semibold text-gray-800 leading-relaxed">
                  {deliveryAddress ? `${deliveryAddress}, ${deliveryCity}, ${deliveryState} - ${deliveryZip}` : 'No address specified'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Payment Mode</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {order.customer?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Order Status</p>
                <span className={`inline-flex items-center space-x-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${status.color}`}>
                  <span>{status.label}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Order Items</h4>
            <div className="space-y-2.5">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white hover:bg-gray-50/50 transition">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 bg-[#fcfaf5] rounded-lg border flex items-center justify-center p-1 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity} Liter</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">₹{item.price * item.quantity}</p>
                    <p className="text-[10px] text-gray-400">₹{item.price} / L</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-gray-100 pt-4 space-y-2.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 items-center">
              <span>Shipping Charge</span>
              {shipping !== null ? (
                <span className="font-semibold text-gray-800">₹{shipping.toLocaleString('en-IN')}</span>
              ) : (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  Pending admin update
                </span>
              )}
            </div>
            <div className="border-t border-dashed pt-3 flex justify-between items-center">
              <div>
                <span className="text-md font-bold text-gray-800">Total Invoice</span>
                {shipping === null && (
                  <p className="text-[10px] text-gray-400">Excluding shipping</p>
                )}
              </div>
              <span className="text-2xl font-extrabold text-primary">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Actions */}
          {order.status === 'pending' && (
            <div className="border-t border-gray-100 pt-5 flex justify-end">
              <button
                onClick={() => onCancelOrder(order.id)}
                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 px-5 py-2.5 rounded-xl font-bold text-sm transition"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onViewDetails }) => {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  
  const subtotal = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || order.subtotal || order.total || 0;
  const shipping = order.shippingCharge || 0;
  const total = order.total || (subtotal + shipping);

  const deliveryAddress = order.customer?.address || order.address;
  const deliveryCity = order.customer?.city || (order.address?.city || '');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition duration-300 space-y-4 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order #{order.id}</p>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </p>
          </div>
          <span className={`inline-flex items-center space-x-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${status.color}`}>
            <StatusIcon className="w-3 h-3" />
            <span>{status.label}</span>
          </span>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="space-y-2 border-t border-gray-50 pt-3">
            {order.items.slice(0, 2).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 truncate max-w-[200px]">{item.name}</span>
                <span className="text-gray-500 text-xs flex-shrink-0 ml-2">x{item.quantity}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-accent font-medium">+{order.items.length - 2} more items</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3 pt-3 border-t border-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Total Amount</p>
            <p className="text-base font-bold text-primary">
              ₹{total.toLocaleString('en-IN')}
              {order.shippingCharge === null && (
                <span className="text-[10px] font-semibold text-amber-600 block leading-tight">
                  + Shipping pending
                </span>
              )}
            </p>
          </div>
          {deliveryAddress && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Delivery To</p>
              <p className="text-xs font-medium text-gray-600 truncate max-w-[140px]">{deliveryCity || deliveryAddress}</p>
            </div>
          )}
        </div>
        
        <div className="pt-2 border-t border-gray-50 flex justify-end">
          <button
            onClick={() => onViewDetails(order)}
            className="inline-flex items-center space-x-1 text-xs font-bold text-accent hover:text-amber-700 transition"
          >
            <span>Track & View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
    <p className="text-sm text-gray-600 italic font-light leading-relaxed">"{review.comment}"</p>
    <p className="text-xs text-gray-400">
      {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
    </p>
  </div>
);

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role === 'admin') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin', { replace: true });
      return;
    }
    const fetchData = async () => {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/reviews'),
        ]);
        const allOrders  = await ordersRes.json();
        const allReviews = await reviewsRes.json();

        // Filter by current user
        const myOrders  = allOrders.filter(o =>
          (o.username && o.username.toLowerCase() === user.username.toLowerCase()) ||
          (o.customerName && o.customerName.toLowerCase() === user.username.toLowerCase()) ||
          (o.name && o.name.toLowerCase() === user.username.toLowerCase()) ||
          (o.customer?.name && o.customer.name.toLowerCase() === user.username.toLowerCase())
        );
        const myReviews = allReviews.filter(r =>
          r.username && r.username.toLowerCase() === user.username.toLowerCase()
        );

        setOrders(myOrders.reverse());
        setReviews(myReviews.reverse());
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (response.ok) {
        // Refresh orders
        const ordersRes = await fetch('/api/orders');
        const allOrders = await ordersRes.json();
        const myOrders  = allOrders.filter(o =>
          (o.username && o.username.toLowerCase() === user.username.toLowerCase()) ||
          (o.customerName && o.customerName.toLowerCase() === user.username.toLowerCase()) ||
          (o.name && o.name.toLowerCase() === user.username.toLowerCase()) ||
          (o.customer?.name && o.customer.name.toLowerCase() === user.username.toLowerCase())
        );
        setOrders(myOrders.reverse());
        
        // Update selected order modal if open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
        }
        alert('Order cancelled successfully.');
      } else {
        alert('Failed to cancel order.');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user.username,
          rating: newRating,
          comment: newComment
        })
      });
      if (response.ok) {
        // Refresh reviews
        const reviewsRes = await fetch('/api/reviews');
        const allReviews = await reviewsRes.json();
        const myReviews = allReviews.filter(r =>
          r.username && r.username.toLowerCase() === user.username.toLowerCase()
        );
        setReviews(myReviews.reverse());
        setNewComment('');
        setNewRating(5);
        setShowReviewForm(false);
        alert('Thank you! Your review has been submitted.');
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!user) return null;

  const totalSpent   = orders.reduce((sum, o) => {
    const t = o.items?.reduce((s, i) => s + i.price * i.quantity, 0) || o.total || 0;
    return sum + t;
  }, 0);
  const deliveredCnt = orders.filter(o => o.status === 'delivered').length;
  const pendingCnt   = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const avgRating    = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const tabs = [
    { id: 'overview', label: 'Overview',      icon: TrendingUp },
    { id: 'orders',   label: 'My Orders',     icon: ShoppingBag },
    { id: 'reviews',  label: 'My Reviews',    icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary via-[#1a3520] to-[#0f2214] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Profile Info */}
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/20 border-2 border-accent/40 flex items-center justify-center text-3xl md:text-4xl font-bold font-serif text-accent shadow-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Member Account</p>
                <h1 className="text-2xl md:text-3xl font-bold font-serif leading-tight">{user.username}</h1>
                <div className="flex items-center space-x-3 mt-1.5 text-white/60 text-xs">
                  <span className="flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{orders.length} Orders</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5" />
                    <span>{reviews.length} Reviews</span>
                  </span>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 bg-accent hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition duration-300 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Now</span>
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={ShoppingBag}  label="Total Orders"   value={orders.length}                         sub="All time"          accent="bg-primary/10 text-primary" />
          <StatCard icon={CheckCircle}  label="Delivered"      value={deliveredCnt}                          sub="Successfully done" accent="bg-green-100 text-green-700" />
          <StatCard icon={Clock}        label="In Progress"    value={pendingCnt}                            sub="Pending/Processing" accent="bg-amber-100 text-amber-700" />
          <StatCard icon={TrendingUp}   label="Total Spent"    value={`₹${totalSpent.toLocaleString('en-IN')}`} sub="Lifetime value"  accent="bg-accent/15 text-accent" />
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm mb-8 overflow-x-auto scrollbar-none">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Welcome Card */}
                <div className="bg-gradient-to-br from-[#f9f7f0] to-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 space-y-3">
                      <h2 className="text-xl md:text-2xl font-bold font-serif text-primary">
                        Welcome back, <span className="text-accent">{user.username}</span>! 👋
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                        Thank you for choosing Vinayaka Pure Oils. Here's a summary of your account activity.
                        Explore our latest products and continue your healthy lifestyle journey.
                      </p>
                      <Link
                        to="/shop"
                        className="inline-flex items-center space-x-2 text-primary font-semibold text-sm hover:text-primaryDark transition"
                      >
                        <span>Browse all products</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <Droplets className="w-8 h-8 text-accent mx-auto mb-1" />
                        <p className="text-xs font-semibold text-gray-600">Pure Oils</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <Heart className="w-8 h-8 text-rose-400 mx-auto mb-1" />
                        <p className="text-xs font-semibold text-gray-600">Healthy Life</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <Star className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                        <p className="text-xs font-semibold text-gray-600">Avg: {avgRating} ⭐</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-serif text-primary">Recent Orders</h3>
                    {orders.length > 2 && (
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-accent hover:text-amber-700 flex items-center space-x-1 transition"
                      >
                        <span>View All</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center space-y-4 shadow-sm">
                      <div className="w-14 h-14 bg-creamDark rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-7 h-7 text-accent" />
                      </div>
                      <h4 className="font-bold font-serif text-primary">No orders yet</h4>
                      <p className="text-sm text-gray-500 max-w-xs mx-auto">Start your healthy journey by exploring our premium cold-pressed oils.</p>
                      <Link to="/shop" className="inline-flex items-center space-x-2 bg-primary hover:bg-primaryDark text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-md">
                        <span>Shop Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orders.slice(0, 4).map(order => (
                        <OrderCard key={order.id} order={order} onViewDetails={setSelectedOrder} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Reviews */}
                {reviews.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold font-serif text-primary">My Reviews</h3>
                      {reviews.length > 2 && (
                        <button
                          onClick={() => setActiveTab('reviews')}
                          className="text-xs font-semibold text-accent hover:text-amber-700 flex items-center space-x-1 transition"
                        >
                          <span>View All</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews.slice(0, 2).map(r => <ReviewCard key={r.id} review={r} />)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-serif text-primary">
                    All Orders <span className="text-accent ml-1">({orders.length})</span>
                  </h3>
                </div>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 bg-creamDark rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8 text-accent" />
                    </div>
                    <h4 className="text-xl font-bold font-serif text-primary">No orders yet</h4>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                      Discover our premium cold-pressed and wood-pressed oils and place your first order!
                    </p>
                    <Link to="/shop" className="inline-flex items-center space-x-2 bg-primary hover:bg-primaryDark text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-md">
                      <span>Start Shopping</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map(order => <OrderCard key={order.id} order={order} onViewDetails={setSelectedOrder} />)}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-serif text-primary">
                    My Reviews <span className="text-accent ml-1">({reviews.length})</span>
                  </h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="inline-flex items-center space-x-2 bg-primary hover:bg-primaryDark text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
                  >
                    <Star className="w-3.5 h-3.5 text-accent" />
                    <span>{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
                  </button>
                </div>

                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Write Your Review</h4>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-sans">Rating</label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-1 hover:scale-110 transition"
                          >
                            <Star className={`w-6 h-6 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-sans">Your Comments</label>
                      <textarea
                        required
                        rows="3"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Tell us what you think of our cold-pressed oils..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition resize-none font-sans"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-primary hover:bg-primaryDark text-white px-6 py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                )}

                {reviews.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 bg-creamDark rounded-full flex items-center justify-center mx-auto">
                      <Star className="w-8 h-8 text-accent" />
                    </div>
                    <h4 className="text-xl font-bold font-serif text-primary">No reviews yet</h4>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">Share your experience with our premium oils and help others discover the goodness of nature.</p>
                    <button onClick={() => setShowReviewForm(true)} className="inline-flex items-center space-x-2 bg-primary hover:bg-primaryDark text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-md">
                      <span>Write a Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Average Rating Banner */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary">{avgRating}</p>
                        <div className="flex items-center space-x-0.5 mt-1 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.round(parseFloat(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Your avg. rating</p>
                      </div>
                      <div className="flex-1 border-l border-gray-100 pl-6">
                        <p className="text-sm text-gray-600">You've written <span className="font-bold text-primary">{reviews.length}</span> review{reviews.length !== 1 ? 's' : ''}.</p>
                        <p className="text-xs text-gray-400 mt-1">Thank you for helping our community make informed choices!</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail & Tracking Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default UserDashboard;
