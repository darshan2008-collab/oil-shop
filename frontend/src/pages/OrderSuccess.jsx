import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 text-center shadow-lg">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6 font-light">Thank you for shopping with Vinayaka Oils.</p>
        
        <div className="bg-[#fcfaf5] border border-gray-200/50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700">
            Order Reference: <span className="font-extrabold text-primary">#{id}</span>
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          We will process your order soon and deliver it to your doorstep. You can check order status with our customer support.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/shop')}
            className="w-full bg-primary hover:bg-primaryDark text-white py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-accent" />
            <span>Continue Shopping</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
