import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const Layout = () => {
  const { user, clearAuth } = useAuthStore();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/20 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="text-3xl font-extrabold gradient-text">
              Buy4Low
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/products"
                className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-200 hover:scale-105 relative group"
              >
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/cart"
                className="text-gray-700 hover:text-primary-600 transition-all duration-200 relative group font-medium"
              >
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-secondary-500 to-primary-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse-slow">
                    {totalItems}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-200 hover:scale-105 relative group"
                  >
                    Orders
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <span className="text-gray-700 font-medium bg-gradient-to-r from-primary-100 to-accent-100 px-4 py-2 rounded-lg">
                    Hello, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link
                to="/cart"
                className="text-gray-700 relative"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-secondary-500 to-primary-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-950 text-white py-12 border-t border-gray-700/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Buy4Low
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your one-stop shop for the best deals and affiliate products. Discover amazing products at unbeatable prices.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link to="/products" className="hover:text-primary-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-primary-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Contact</h4>
              <p className="text-gray-400 mb-2">
                Email: <a href="mailto:support@buy4low.com" className="text-primary-400 hover:text-primary-300 transition-colors">support@buy4low.com</a>
              </p>
              <div className="flex space-x-4 mt-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-sm">📧</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-accent-600 to-accent-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-sm">💬</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700/50 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 Buy4Low. All rights reserved. | 
              <span className="text-primary-400"> Modern shopping experience</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

