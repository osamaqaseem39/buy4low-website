import { Product } from '../types';

interface ProductBadgesProps {
  product: Product;
  className?: string;
}

const ProductBadges = ({ product, className = '' }: ProductBadgesProps) => {
  const badges = [];

  // Sale badge
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    const discountPercent = Math.round(
      ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
    );
    badges.push({
      label: `${discountPercent}% OFF`,
      className: 'bg-gradient-to-r from-secondary-500 to-red-500 text-white',
      priority: 1,
    });
  }

  // New badge (if product is less than 30 days old)
  if (product.createdAt) {
    const daysSinceCreation =
      (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation < 30) {
      badges.push({
        label: 'NEW',
        className: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white',
        priority: 2,
      });
    }
  }

  // Featured badge (could be based on rating or manual flag)
  if (product.rating && product.rating >= 4.5) {
    badges.push({
      label: 'BESTSELLER',
      className: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
      priority: 3,
    });
  }

  // Low stock badge
  if (product.stock > 0 && product.stock < 10) {
    badges.push({
      label: 'LIMITED',
      className: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      priority: 4,
    });
  }

  // Affiliate badge
  if (product.isAffiliate) {
    badges.push({
      label: 'AFFILIATE',
      className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
      priority: 5,
    });
  }

  // Sort by priority and take top 2
  const displayBadges = badges.sort((a, b) => a.priority - b.priority).slice(0, 2);

  if (displayBadges.length === 0) return null;

  return (
    <div className={`absolute top-3 left-3 flex flex-col gap-2 z-10 ${className}`}>
      {displayBadges.map((badge, index) => (
        <span
          key={index}
          className={`${badge.className} px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse-slow`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
};

export default ProductBadges;

