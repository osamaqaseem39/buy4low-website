import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductBadges from './ProductBadges';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  showQuickActions?: boolean;
}

const ProductCard = ({ product, showQuickActions = true }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.isAffiliate && product.stock > 0) {
      addItem(product, 1);
      toast.success('Added to cart!');
    }
  };

  return (
    <div className="card-hover group relative">
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden rounded-xl mb-4 h-48 bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={product.thumbnail || product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <ProductBadges product={product} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!) ? 'fill-current' : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        {product.shortDescription && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-gray-400 line-through ml-2 text-sm">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        {product.stock > 0 && product.stock < 10 && (
          <p className="text-xs text-orange-600 font-medium mt-2">
            Only {product.stock} left in stock
          </p>
        )}
      </Link>

      {/* Quick Actions */}
      {showQuickActions && !product.isAffiliate && product.stock > 0 && (
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:scale-110 transform"
          title="Add to cart"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ProductCard;

