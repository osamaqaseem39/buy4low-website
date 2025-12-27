import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProducts } from '../api/products';
import api from '../api/axios';
import { Product } from '../types';

const CategoryProducts = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: categoryData } = useQuery(
    ['category', slug],
    () => api.get(`/categories/slug/${slug}`).then(res => res.data),
    { enabled: !!slug }
  );

  const { data: productsData, isLoading } = useQuery(
    ['products', 'category', categoryData?.data?._id],
    () => getProducts({ category: categoryData?.data?._id, limit: 24 }),
    { enabled: !!categoryData?.data?._id }
  );

  const category = categoryData?.data;
  const products: Product[] = productsData?.data || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-600">Category not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/" className="text-primary-600 hover:underline">
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
      {category.description && (
        <p className="text-gray-600 mb-8">{category.description}</p>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="card hover:shadow-xl transition-shadow"
            >
              <img
                src={product.thumbnail || product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.name}
              </h3>
              {product.shortDescription && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.compareAtPrice &&
                    product.compareAtPrice > product.price && (
                      <span className="text-gray-500 line-through ml-2 text-sm">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                </div>
                {product.isAffiliate && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Affiliate
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;

