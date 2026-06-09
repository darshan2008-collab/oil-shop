import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User as UserIcon, LogIn, UserPlus, Sparkles, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { username, password, confirmPassword } = formData;

    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      if (isLoginMode) {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password);
      }
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Brand Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-white border border-gray-100 p-8 rounded-2xl shadow-xl z-10 transition-all duration-300">
        
        {/* Header/Brand Info */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-primary/5 rounded-full border border-primary/10">
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold font-serif text-primary tracking-wide">
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
            {isLoginMode 
              ? 'Sign in to access premium wood-pressed and cold-pressed cooking oils.' 
              : 'Register today to get pure cooking oils delivered to your doorstep.'}
          </p>
        </div>

        {/* Tab Toggle buttons */}
        <div className="grid grid-cols-2 p-1 bg-creamDark rounded-xl border border-gray-200/50">
          <button
            type="button"
            onClick={() => !isLoginMode && handleToggleMode()}
            className={`flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              isLoginMode 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => isLoginMode && handleToggleMode()}
            className={`flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              !isLoginMode 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start space-x-2 animate-shake">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition focus:outline-none bg-cream/30"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition focus:outline-none bg-cream/30"
                />
              </div>
            </div>

            {/* Confirm Password (only in Register Mode) */}
            {!isLoginMode && (
              <div className="transition-all duration-300">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition focus:outline-none bg-cream/30"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primaryDark disabled:bg-primary/50 text-white py-3.5 rounded-xl font-semibold transition duration-300 shadow-md flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isLoginMode ? 'Sign In' : 'Create Account'}</span>
                {isLoginMode ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>

        {/* Footer Guarantee info */}
        <div className="border-t border-gray-100 pt-6 text-center flex items-center justify-center space-x-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>Secured authentication portal</span>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
