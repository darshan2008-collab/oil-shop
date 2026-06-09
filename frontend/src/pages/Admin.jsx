import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  TrendingUp, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  Search,
  Plus,
  Edit,
  Package,
  Upload
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    tamilName: '',
    price: '',
    description: '',
    category: 'cooking',
    image: ''
  });
  const [editProductForm, setEditProductForm] = useState({
    name: '',
    tamilName: '',
    price: '',
    description: '',
    category: 'cooking',
    image: ''
  });

  useEffect(() => {
    if (!localStorage.getItem('isAdminLoggedIn')) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductForm(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProductForm(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProductForm.image) {
      alert('Please upload an image.');
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProductForm)
      });

      if (response.ok) {
        fetchProducts();
        setShowAddProductModal(false);
        setNewProductForm({
          name: '',
          tamilName: '',
          price: '',
          description: '',
          category: 'cooking',
          image: ''
        });
        alert('Product added successfully!');
      } else {
        alert('Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditProductForm({
      name: product.englishName || '',
      tamilName: product.tamilName || '',
      price: product.price ? product.price.toString() : '',
      description: product.description || '',
      category: product.category || 'cooking',
      image: product.image || ''
    });
    setShowEditProductModal(true);
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editProductForm.name,
          tamilName: editProductForm.tamilName,
          price: parseInt(editProductForm.price),
          description: editProductForm.description,
          category: editProductForm.category,
          image: editProductForm.image
        })
      });

      if (response.ok) {
        fetchProducts();
        setShowEditProductModal(false);
        setEditingProduct(null);
        alert('Product updated successfully!');
      } else {
        alert('Failed to update product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchProducts();
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.reverse()); // Show newest first
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders();
        // Update selected order modal if open
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        alert(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchOrders();
        setSelectedOrder(null);
        alert('Order deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  // Filter & Search Orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'all' || order.status === filter;
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm) ||
      order.id.toString() === searchTerm.replace('#', '');
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'processing': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'delivered': return 'bg-green-50 border-green-200 text-green-800';
      case 'cancelled': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'processing': return <RefreshCw className="w-3.5 h-3.5 animate-spin" />;
      case 'delivered': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 font-light">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf5]">
      {/* Admin Header */}
      <header className="bg-primary text-white shadow-md border-b border-primaryDark">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/images/logo.png" alt="Vinayaka Logo" className="w-10 h-10 object-contain brightness-0 invert" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold font-serif leading-tight">Admin Dashboard</h1>
                <p className="text-accent text-xs tracking-wider uppercase font-semibold">Vinayaka Oils Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition text-xs sm:text-sm"
            >
              <LogOut className="w-4 h-4 text-accent" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8 md:px-6">
        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 mb-6 space-x-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-semibold border-b-2 transition duration-300 flex items-center space-x-2 ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Management</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-semibold border-b-2 transition duration-300 flex items-center space-x-2 ${
              activeTab === 'products'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Management</span>
          </button>
        </div>

        {activeTab === 'orders' ? (
          <>
            {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-primary mt-1 sm:mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Pending</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-yellow-600 mt-1 sm:mt-2">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-2xl text-yellow-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Processing</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1 sm:mt-2">{stats.processing}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Delivered</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-green-600 mt-1 sm:mt-2">{stats.delivered}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Revenue</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-primary mt-1 sm:mt-2">₹{stats.revenue}</p>
              </div>
              <div className="p-3 bg-primary/5 rounded-2xl text-accent">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls, Search, and Orders list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col space-y-3 sm:space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg sm:text-xl font-bold font-serif text-gray-800">Orders List</h2>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, phone, ID..."
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition w-full sm:w-64"
                />
              </div>
              
              <div className="flex flex-wrap gap-1 bg-gray-50 p-1 border rounded-xl">
                {['all', 'pending', 'processing', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold capitalize transition ${
                      filter === status
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:text-primary hover:bg-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-16 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-light text-sm">No orders found matching the filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items Count</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order Date</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/40 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-primary">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{order.customer.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{order.customer.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800 text-sm">₹{order.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 bg-gray-50 text-blue-600 hover:bg-blue-50 border rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-1.5 bg-gray-50 text-red-600 hover:bg-red-50 border rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    ) : (
          /* Products Management View */
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-800">Products Management</h2>
                <p className="text-xs text-gray-400 mt-1">Manage, update, and add cooking and wellness oils</p>
              </div>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="flex items-center space-x-2 bg-primary hover:bg-primaryDark text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-semibold transition text-sm shadow-md"
              >
                <Plus className="w-4 h-4 text-accent" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-light text-sm">No products found. Add a new product to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between group">
                    <div className="bg-[#fcfaf5] p-6 flex items-center justify-center h-48 relative border-b border-gray-50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-32 w-auto object-contain drop-shadow-md group-hover:scale-105 transition duration-500" 
                      />
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="font-bold text-lg text-gray-800 font-serif leading-tight">{product.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{product.description}</p>
                      </div>
                      
                      <div className="space-y-4 pt-2 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Price</span>
                          <span className="text-xl font-extrabold text-primary">₹{product.price} <span className="text-xs font-normal text-gray-400">/ L</span></span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="flex items-center justify-center space-x-1 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2 rounded-xl text-xs font-semibold transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Details</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex items-center justify-center space-x-1 border border-red-100 hover:border-red-200 text-red-500 hover:bg-red-50 py-2 rounded-xl text-xs font-semibold transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal Popup */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-primary">Order #{selectedOrder.id} Details</h3>
                <p className="text-xs text-gray-400 mt-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-semibold rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info Card */}
              <div className="bg-[#fcfaf5] border border-gray-200/50 rounded-xl p-5 space-y-3">
                <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b pb-1 border-gray-200/30">Customer Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="font-semibold text-gray-800">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="font-semibold text-gray-800">{selectedOrder.customer.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-semibold text-gray-800">{selectedOrder.customer.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">Shipping Address</p>
                    <p className="font-semibold text-gray-800 leading-relaxed">
                      {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Order Items</h4>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white hover:bg-gray-50/50 transition">
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

              {/* Total & Payment details */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Payment Mode</p>
                  <p className="text-sm font-bold text-gray-700 capitalize mt-0.5">
                    {selectedOrder.customer.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Invoice</p>
                  <p className="text-2xl font-extrabold text-primary mt-0.5">₹{selectedOrder.total}</p>
                </div>
              </div>

              {/* Status Update Options */}
              <div className="border-t border-gray-100 pt-5 space-y-3">
                <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Update Order Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'processing', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      className={`px-4 py-2 border rounded-xl capitalize font-semibold text-xs transition-all duration-300 flex items-center space-x-1.5 ${
                        selectedOrder.status === status
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white hover:bg-primary border-gray-200 hover:border-primary text-gray-700 hover:text-white shadow-sm'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-primary">Add New Product</h3>
                <p className="text-xs text-gray-400 mt-1">Fill in the details to add a new oil product</p>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Name (English)</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Mustard Oil"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Name (Tamil - Optional)</label>
                <input
                  type="text"
                  value={newProductForm.tamilName}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, tamilName: e.target.value }))}
                  placeholder="e.g. கடுகு எண்ணெய்"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition bg-white"
                  >
                    <option value="cooking">Cooking Oil</option>
                    <option value="wellness">Wellness Oil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price (₹ / Liter)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 300"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  required
                  rows="3"
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the benefits and extraction process..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Image</label>
                <div className="border-2 border-dashed border-gray-200 hover:border-primary/50 rounded-xl p-6 text-center cursor-pointer transition relative">
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {newProductForm.image ? (
                    <div className="space-y-2">
                      <img 
                        src={newProductForm.image} 
                        alt="Preview" 
                        className="h-28 mx-auto object-contain rounded-lg shadow-sm"
                      />
                      <p className="text-xs text-green-600 font-semibold flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Image selected successfully! Click to change.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-gray-400">
                      <Upload className="w-8 h-8 mx-auto" />
                      <p className="text-xs font-medium">Click to upload product image</p>
                      <p className="text-[10px] text-gray-400">Supports PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primaryDark text-white py-3.5 rounded-xl font-bold transition shadow-md flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4 text-accent" />
                <span>Add Product to Shop</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-primary">Edit Product</h3>
                <p className="text-xs text-gray-400 mt-1">Update details for {editingProduct?.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditProductModal(false);
                  setEditingProduct(null);
                }}
                className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Name (English)</label>
                <input
                  type="text"
                  required
                  value={editProductForm.name}
                  onChange={(e) => setEditProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Mustard Oil"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Name (Tamil - Optional)</label>
                <input
                  type="text"
                  value={editProductForm.tamilName}
                  onChange={(e) => setEditProductForm(prev => ({ ...prev, tamilName: e.target.value }))}
                  placeholder="e.g. கடுகு எண்ணெய்"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={editProductForm.category}
                    onChange={(e) => setEditProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition bg-white"
                  >
                    <option value="cooking">Cooking Oil</option>
                    <option value="wellness">Wellness Oil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price (₹ / Liter)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editProductForm.price}
                    onChange={(e) => setEditProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 300"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  required
                  rows="3"
                  value={editProductForm.description}
                  onChange={(e) => setEditProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the benefits..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Image (Optional)</label>
                <div className="border-2 border-dashed border-gray-200 hover:border-primary/50 rounded-xl p-6 text-center cursor-pointer transition relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditProductImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {editProductForm.image ? (
                    <div className="space-y-2">
                      <img 
                        src={editProductForm.image} 
                        alt="Preview" 
                        className="h-28 mx-auto object-contain rounded-lg shadow-sm"
                      />
                      <p className="text-xs text-green-600 font-semibold flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Image selected! Click to change.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-gray-400">
                      <Upload className="w-8 h-8 mx-auto" />
                      <p className="text-xs font-medium">Click to upload product image</p>
                      <p className="text-[10px] text-gray-400">Supports PNG, JPG, JPEG</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primaryDark text-white py-3.5 rounded-xl font-bold transition shadow-md flex items-center justify-center space-x-2"
              >
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
