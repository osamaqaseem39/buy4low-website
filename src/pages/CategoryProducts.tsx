import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProducts } from '../api/products';
import api from '../api/axios';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';

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
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: 'Categories', to: '/' },
          { label: category.name },
        ]}
      />

      <div className="mb-10">
        <h1 className="text-5xl font-extrabold mb-4 gradient-text">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 text-lg mb-2">{category.description}</p>
        )}
        <p className="text-gray-500">{products.length} products found</p>
      </div>

      {products.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-xl">No products found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;

