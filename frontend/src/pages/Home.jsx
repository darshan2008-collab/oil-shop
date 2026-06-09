import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Droplets, Heart, Truck, Shield, Headphones, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));

    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Error fetching reviews:', err));
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });
      if (response.ok) {
        const addedReview = await response.json();
        setReviews(prevReviews => [...prevReviews, addedReview]);
        setNewReview({ rating: 5, comment: '' });
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-sans bg-cream text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream via-[#f5f2e9] to-creamDark py-8 sm:py-12 md:py-20 lg:py-24 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 md:space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold font-serif text-primary leading-tight">
                  Pure Oils <br className="hidden md:inline" />
                  <span className="text-secondary italic">For a Healthy Life</span>
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs sm:text-sm md:text-base uppercase tracking-wider text-accent font-bold">
                  100% Natural | Cold Pressed | No Chemicals
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light italic">
                  Goodness of nature in every drop.
                </p>
              </div>

              <div>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center space-x-2 bg-primary hover:bg-primaryDark text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5 text-accent" />
                </Link>
              </div>

              {/* Bottom Feature Badges */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-200/50">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-white rounded-full shadow-sm border border-gray-100/50 text-accent flex-shrink-0">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-[11px] sm:text-sm">100% Natural</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">No Additives</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-white rounded-full shadow-sm border border-gray-100/50 text-accent flex-shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-[11px] sm:text-sm">Cold Pressed</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Wood Pressed</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-white rounded-full shadow-sm border border-gray-100/50 text-accent flex-shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-[11px] sm:text-sm">Healthy Choice</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">For Your Family</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Images */}
            <div className="lg:col-span-6 flex justify-center relative">
              <div className="relative w-full max-w-lg md:max-w-xl">
                {/* Decorative background shape */}
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-secondary/10 rounded-full filter blur-3xl -z-10"></div>
                <img 
                  src="/images/hero-oils.png" 
                  alt="Vinayaka Premium Oils Showcase" 
                  className="w-full h-auto object-contain rounded-3xl shadow-2xl border border-creamDark/25 hover:scale-[1.01] transition duration-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Oils Section */}
      <section className="py-10 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-3 mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-primary">Our Oils</h2>
            <div className="flex items-center justify-center space-x-2">
              <span className="h-[1px] w-12 bg-accent"></span>
              <span className="text-accent text-lg">🌱</span>
              <span className="h-[1px] w-12 bg-accent"></span>
            </div>
          </div>

          <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 pb-4 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col group flex-shrink-0 w-[200px] sm:w-auto snap-start"
              >
                {/* Product Image Wrapper */}
                <div className="bg-[#fcfaf5] p-4 flex items-center justify-center h-40 sm:h-52 md:h-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-creamDark/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-28 sm:h-40 md:h-48 w-auto object-contain transform group-hover:scale-105 transition duration-500 drop-shadow-md"
                  />
                </div>
                
                {/* Product details */}
                <div className="p-3 sm:p-5 flex-grow flex flex-col justify-between text-center space-y-3 sm:space-y-4 whitespace-normal">
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="font-bold text-sm sm:text-lg text-gray-800 font-serif leading-tight group-hover:text-primary transition duration-300">
                      {product.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="pt-1 sm:pt-2 flex flex-col items-center space-y-2 sm:space-y-3">
                    <span className="text-sm sm:text-lg font-bold text-primary">₹{product.price} / L</span>
                    <Link 
                      to="/shop" 
                      className="w-full py-1.5 sm:py-2 px-3 sm:px-4 rounded-full border border-gray-200 hover:border-primary text-gray-700 hover:text-white hover:bg-primary font-medium text-xs sm:text-sm transition duration-300"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-10 sm:py-16 md:py-24 bg-[#fbf9f3] border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-primary">
              Why Choose Vinayaka Oils?
            </h2>
            <div className="h-1 w-16 bg-accent mx-auto rounded-full"></div>
            <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
              We bring you the finest quality oils extracted traditionally to preserve natural goodness, nutrition, and authentic taste.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center p-4 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-creamDark border border-accent/20 rounded-full flex items-center justify-center mx-auto text-accent">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="font-bold font-serif text-sm sm:text-lg text-primary">100% Natural</h3>
              <p className="text-[11px] sm:text-sm text-gray-500 leading-relaxed">
                Free from chemicals, artificial additives, and preservatives.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-creamDark border border-accent/20 rounded-full flex items-center justify-center mx-auto text-accent">
                <Droplets className="w-8 h-8" />
              </div>
              <h3 className="font-bold font-serif text-sm sm:text-lg text-primary">Cold Pressed</h3>
              <p className="text-[11px] sm:text-sm text-gray-500 leading-relaxed">
                Extracted using traditional wood-pressing methods at low temperatures.
              </p>
            </div>

            <div className="text-center p-4 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-creamDark border border-accent/20 rounded-full flex items-center justify-center mx-auto text-accent">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-bold font-serif text-sm sm:text-lg text-primary">Premium Quality</h3>
              <p className="text-[11px] sm:text-sm text-gray-500 leading-relaxed">
                Carefully sourced oil seeds processed under hygienic conditions.
              </p>
            </div>

            <div className="text-center p-4 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300 space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-creamDark border border-accent/20 rounded-full flex items-center justify-center mx-auto text-accent">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-bold font-serif text-sm sm:text-lg text-primary">Healthy Living</h3>
              <p className="text-[11px] sm:text-sm text-gray-500 leading-relaxed">
                Contains active nutrients, antioxidants, and essential healthy fats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Make Every Meal Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-[#f9f7f0] rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
              {/* Image Column */}
              <div className="md:col-span-5 h-[200px] sm:h-[300px] md:h-[400px] relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" 
                  alt="Delicious Healthy Dish cooked with Vinayaka Oils" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
              </div>
              
              {/* Content Column */}
              <div className="md:col-span-7 p-5 sm:p-8 md:p-12 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <p className="text-accent text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider">Good Food, Good Life</p>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-primary leading-tight">
                    Make Every Meal <br />
                    Healthier & Tastier
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed max-w-xl">
                  Cook with the purity of wood pressed oils. Experience natural aromas and enhance the authentic flavors of your traditional recipes.
                </p>
                <div>
                  <Link 
                    to="/shop" 
                    className="inline-flex items-center space-x-2 bg-primary hover:bg-primaryDark text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition duration-300 shadow-md"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="py-12 md:py-16 bg-gradient-to-tr from-creamDark/40 to-cream border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
            <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition">
              <div className="p-3.5 bg-creamDark rounded-2xl text-accent border border-accent/10">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-primary font-serif">Fast & Safe Delivery</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-1">
                  Freshly packaged oil delivered to your doorstep quickly and safely.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition">
              <div className="p-3.5 bg-creamDark rounded-2xl text-accent border border-accent/10">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-primary font-serif">Secure Payments</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-1">
                  100% secure payment systems with standard encryption.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition">
              <div className="p-3.5 bg-creamDark rounded-2xl text-accent border border-accent/10">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-primary font-serif">Customer Support</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-1">
                  Have questions? Talk to our oil experts anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 md:py-24 bg-cream border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-3 mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-primary">
              Customer Reviews
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <span className="h-[1px] w-12 bg-accent"></span>
              <span className="text-accent text-lg">⭐</span>
              <span className="h-[1px] w-12 bg-accent"></span>
            </div>
            <p className="text-sm sm:text-base text-gray-600 font-light max-w-xl mx-auto">
              Real feedback from our customers who choose purity and health for their family.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100/50 shadow-sm max-w-md mx-auto space-y-4">
                  <div className="text-4xl">🌱</div>
                  <h3 className="text-xl font-bold font-serif text-primary">No reviews yet</h3>
                  <p className="text-gray-500 font-light text-sm max-w-xs mx-auto">
                    Be the first to share your experience with our premium wood-pressed cooking oils!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition duration-300 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {/* Rating Stars */}
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                        {/* Comment */}
                        <p className="text-gray-700 text-sm font-light leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                      
                      {/* Reviewer Info */}
                      <div className="flex items-center space-x-3 pt-3 border-t border-gray-50">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs flex-shrink-0">
                          {rev.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-gray-800 truncate">{rev.username}</h4>
                          <p className="text-[10px] text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submission Form / Call to Action */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold font-serif text-primary">Write a Review</h3>
                    <p className="text-xs text-gray-500 font-light">Share your honest feedback about our oils.</p>
                  </div>

                  {/* Interactive Rating Stars */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Your Rating
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isGold = hoverRating ? starVal <= hoverRating : starVal <= newReview.rating;
                        return (
                          <button
                            type="button"
                            key={starVal}
                            onClick={() => setNewReview({ ...newReview, rating: starVal })}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 hover:scale-110 transition cursor-pointer"
                            aria-label={`Rate ${starVal} stars`}
                          >
                            <Star 
                              className={`w-6 h-6 ${isGold ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comment Textarea */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Your Review
                    </label>
                    <textarea
                      rows="4"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      required
                      placeholder="What did you think of the taste, aroma, and quality?"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition focus:outline-none bg-cream/35 resize-none placeholder-gray-400 font-light"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || !newReview.comment.trim()}
                    className="w-full bg-primary hover:bg-primaryDark disabled:bg-primary/50 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md text-xs sm:text-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center py-6">
                  <div className="w-12 h-12 bg-creamDark rounded-full flex items-center justify-center mx-auto text-accent border border-accent/10">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="text-md sm:text-lg font-bold font-serif text-primary">Share your experience</h3>
                  <p className="text-xs text-gray-500 font-light max-w-xs mx-auto leading-relaxed">
                    Have you tried our wood pressed oils? Sign in to submit your rating and review.
                  </p>
                  <Link 
                    to="/login" 
                    className="inline-block w-full bg-primary hover:bg-primaryDark text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md text-xs"
                  >
                    Sign In to Write a Review
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
