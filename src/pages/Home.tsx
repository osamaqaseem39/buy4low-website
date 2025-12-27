import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getCategories } from '../api/categories';
import { getProducts } from '../api/products';
import { Category, Product } from '../types';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const { data: categoriesData } = useQuery('categories', getCategories);
  const { data: productsData } = useQuery(
    'featured-products',
    () => getProducts({ limit: 8, sort: '-createdAt' })
  );

  useEffect(() => {
    if (productsData?.data) {
      setFeaturedProducts(productsData.data);
    }
  }, [productsData]);

  const categories: Category[] = categoriesData?.data || [];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 animate-slide-up">
            Welcome to <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">Buy4Low</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
            Discover amazing deals and shop from our curated selection of premium products
          </p>
          <Link 
            to="/products" 
            className="inline-block px-8 py-4 bg-white text-primary-700 rounded-xl font-bold text-lg hover:scale-110 hover:shadow-2xl transition-all duration-300 transform animate-slide-up"
            style={{animationDelay: '0.2s'}}
          >
            Shop Now →
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 section-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">Shop by Category</h2>
              <p className="text-gray-600 text-lg">Explore our diverse range of product categories</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category, index) => (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="card-hover text-center group"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {category.image && (
                    <div className="relative overflow-hidden rounded-xl mb-4 h-32 bg-gradient-to-br from-primary-100 to-accent-100">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary-600 to-accent-500 mx-auto mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">Featured Products</h2>
            <p className="text-gray-600 text-lg">Handpicked products just for you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="card-hover group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative overflow-hidden rounded-xl mb-4 h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={product.thumbnail || product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.isAffiliate && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Affiliate
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
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
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-sm">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="btn btn-primary text-lg px-8"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

