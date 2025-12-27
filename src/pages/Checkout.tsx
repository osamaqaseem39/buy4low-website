import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/Breadcrumbs';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const totalPrice = getTotalPrice();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    paymentMethod: 'credit_card',
  });

  const { mutate: createOrder, isLoading } = useMutation(
    async (orderData: any) => {
      const response = await api.post('/orders', orderData);
      return response.data;
    },
    {
      onSuccess: () => {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to place order');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    const orderItems = items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    createOrder({
      items: orderItems,
      shippingAddress: formData,
      paymentMethod: formData.paymentMethod,
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card text-center">
          <p className="text-gray-600 mb-4">Please login to checkout</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: 'Cart', to: '/cart' },
          { label: 'Checkout' },
        ]}
      />
      <h1 className="text-5xl font-extrabold mb-8 gradient-text">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <h2 className="text-3xl font-extrabold gradient-text">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Zip Code</label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="input"
                />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold mb-4 gradient-text">Payment Method</h3>
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
                className="input text-lg"
              >
                <option value="credit_card">💳 Credit Card</option>
                <option value="debit_card">💳 Debit Card</option>
                <option value="paypal">🅿️ PayPal</option>
                <option value="cash_on_delivery">💰 Cash on Delivery</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-lg py-4"
            >
              {isLoading ? 'Placing Order...' : 'Complete Order →'}
            </button>
          </form>

          {/* Additional Trust Elements */}
          <div className="card bg-gradient-to-br from-gray-50 to-white">
            <h3 className="text-xl font-bold mb-4">Why Shop With Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">↩️</span>
                <div>
                  <p className="font-semibold">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-semibold">24/7 Support</p>
                  <p className="text-sm text-gray-600">We're here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-24 bg-white/90 backdrop-blur-md">
            <h2 className="text-3xl font-extrabold mb-6 gradient-text">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <img
                    src={item.product.thumbnail || item.product.images[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm line-clamp-2">{item.product.name}</p>
                    <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-primary-600">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-gray-200 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-2xl font-extrabold pt-2 border-t border-gray-200">
                <span className="gradient-text">Total</span>
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Trust Elements */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🔒</span>
                <span className="font-bold text-gray-900">Secure Checkout</span>
              </div>
              <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
            </div>

            <Link
              to="/cart"
              className="block text-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

