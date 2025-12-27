import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import Breadcrumbs from '../components/Breadcrumbs';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-extrabold mb-8 gradient-text">Shopping Cart</h1>
        <div className="card text-center py-16">
          <div className="text-6xl mb-6">🛒</div>
          <p className="text-gray-600 text-xl mb-6">Your cart is empty</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />
      <h1 className="text-5xl font-extrabold mb-10 gradient-text">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="card-hover flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                <img
                  src={item.product.thumbnail || item.product.images[0] || '/placeholder.jpg'}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Link
                  to={`/products/${item.product._id}`}
                  className="text-xl font-bold hover:text-primary-600 transition-colors gradient-text hover:from-primary-600 hover:to-secondary-600"
                >
                  {item.product.name}
                </Link>
                <p className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mt-2">
                  ${item.product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      removeItem(item.product._id);
                      toast.success('Item removed from cart');
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="card sticky top-24 bg-white/90 backdrop-blur-md">
            <h2 className="text-3xl font-extrabold mb-6 gradient-text">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-4 flex justify-between">
                <span className="text-2xl font-extrabold gradient-text">Total</span>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <Link to="/checkout" className="btn btn-primary w-full mb-4 text-lg py-4">
              Proceed to Checkout →
            </Link>
            <Link to="/products" className="btn btn-outline w-full">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

