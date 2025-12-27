import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProducts, GetProductsParams } from '../api/products';
import { getCategories } from '../api/categories';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<GetProductsParams>({
    page: 1,
    limit: 12,
    sort: '-createdAt',
    search: searchParams.get('search') || undefined,
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const { data: productsData, isLoading } = useQuery(
    ['products', filters],
    () => getProducts(filters)
  );

  const { data: categoriesData } = useQuery('categories', getCategories);

  const products: Product[] = productsData?.data || [];
  const categories: Category[] = categoriesData?.data || [];
  const totalPages = productsData?.pages || 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleCategoryFilter = (categoryId: string) => {
    setFilters({
      ...filters,
      category: categoryId === 'all' ? undefined : categoryId,
      page: 1,
    });
  };

  const handleSort = (sort: string) => {
    setFilters({ ...filters, sort, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Products' }]} />
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold mb-4 gradient-text">All Products</h1>
        <p className="text-gray-600 text-lg">Browse through our complete collection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="card sticky top-24 bg-white/90 backdrop-blur-md">
            <h2 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Filters</h2>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input mb-2"
              />
              <button type="submit" className="btn btn-primary w-full">
                Search
              </button>
            </form>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter('all')}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    !filters.category
                      ? 'bg-primary-100 text-primary-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryFilter(category._id)}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      filters.category === category._id
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <select
                value={filters.sort || '-createdAt'}
                onChange={(e) => handleSort(e.target.value)}
                className="input"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="-name">Name: Z to A</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                Showing {products.length} of {productsData?.total || 0} products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        page: (filters.page || 1) - 1,
                      })
                    }
                    disabled={filters.page === 1}
                    className="btn btn-outline disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setFilters({ ...filters, page: i + 1 })}
                      className={`btn ${
                        filters.page === i + 1 ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        page: (filters.page || 1) + 1,
                      })
                    }
                    disabled={filters.page === totalPages}
                    className="btn btn-outline disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

