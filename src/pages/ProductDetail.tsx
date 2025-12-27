import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProduct } from '../api/products';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data, isLoading, error } = useQuery(
    ['product', id],
    () => getProduct(id!),
    { enabled: !!id }
  );

  const product = data?.data;

  const handleAddToCart = () => {
    if (product && !product.isAffiliate) {
      addItem(product, quantity);
      toast.success('Product added to cart!');
    }
  };

  const handleAffiliateRedirect = () => {
    if (product?.affiliateLink) {
      // Add affiliate tag if needed
      const url = new URL(product.affiliateLink);
      if (process.env.VITE_AMAZON_ASSOCIATE_TAG) {
        url.searchParams.set('tag', process.env.VITE_AMAZON_ASSOCIATE_TAG);
      }
      window.open(url.toString(), '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link to="/products" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors group">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="mb-6 card overflow-hidden p-4 bg-gradient-to-br from-gray-50 to-white">
            <img
              src={product.images[selectedImage] || product.thumbnail || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-96 object-contain rounded-xl"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-primary-600 ring-2 ring-primary-200 scale-105' 
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 gradient-text">{product.name}</h1>
          
          {product.brand && (
            <p className="text-gray-600 mb-4">Brand: {product.brand}</p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating!) ? 'fill-current' : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                  <span className="bg-gradient-to-r from-secondary-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-3 bg-gray-100 inline-block px-3 py-1 rounded-lg">SKU: {product.sku}</p>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-lg font-semibold border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                In Stock ({product.stock} available)
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 px-4 py-2 rounded-lg font-semibold border border-red-200">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Out of Stock
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {!product.isAffiliate && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border-0 outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full btn btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>
          )}

          {/* Affiliate Button */}
          {product.isAffiliate && product.affiliateLink && (
            <div className="mb-6">
              <button
                onClick={handleAffiliateRedirect}
                className="w-full btn bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-lg py-4 shadow-lg hover:shadow-xl"
              >
                🛒 Buy on Amazon
              </button>
              <p className="text-sm text-gray-600 mt-3 text-center">
                This product is available on Amazon. Click to purchase.
              </p>
            </div>
          )}

          {/* Short Description */}
          {product.shortDescription && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quick Overview</h3>
              <p className="text-gray-700">{product.shortDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Description */}
      <div className="mt-16">
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-3xl font-extrabold mb-6 gradient-text">Product Description</h2>
          <div className="prose max-w-none card">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-extrabold mb-6 gradient-text">Specifications</h2>
          <div className="card bg-gradient-to-br from-gray-50 to-white">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="border-b border-gray-200 pb-4 last:border-0">
                  <dt className="font-bold text-gray-800 mb-1">{key}</dt>
                  <dd className="text-gray-600">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/* Dimensions & Weight */}
      {(product.dimensions || product.shippingWeight) && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            {product.dimensions && (
              <p className="mb-2">
                <span className="font-semibold">Dimensions: </span>
                {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
              </p>
            )}
            {product.shippingWeight && (
              <p>
                <span className="font-semibold">Weight: </span>
                {product.shippingWeight} lbs
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

