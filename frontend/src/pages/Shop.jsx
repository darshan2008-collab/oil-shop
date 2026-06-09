import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      alert(`Please sign in to add ${product.name} to your cart.`);
      navigate('/login', { state: { from: location } });
      return;
    }
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const categories = [
    { id: 'all', name: 'All Oils' },
    { id: 'cooking', name: 'Cooking Oils' },
    { id: 'wellness', name: 'Wellness Oils' }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-cream py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-3 mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-primary">Our Products</h1>
          <div className="h-1 w-16 bg-accent mx-auto rounded-full"></div>
          <p className="text-sm sm:text-base text-gray-600 font-light max-w-xl mx-auto">
            100% wood pressed and cold pressed oils. Experience natural nutrition and authentic taste.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-start sm:justify-center overflow-x-auto whitespace-nowrap scrollbar-none pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 space-x-2 md:space-x-4 mb-8 sm:mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm border ${
                activeCategory === category.id
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div className="bg-[#fcfaf5] p-4 sm:p-8 flex items-center justify-center h-40 sm:h-52 relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-28 sm:h-40 w-auto object-contain transform group-hover:scale-105 transition duration-500 drop-shadow-md"
                />
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-6 flex-grow flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-lg font-serif text-gray-800 group-hover:text-primary transition duration-300 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {product.description}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-100 pt-3">
                    <div>
                      <span className="text-lg sm:text-2xl font-extrabold text-primary">₹{product.price}</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 ml-1">/ L</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary hover:bg-primaryDark text-white py-2 sm:py-3 rounded-xl font-semibold transition duration-300 flex items-center justify-center space-x-1 sm:space-x-2 shadow-sm text-xs sm:text-sm"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
