const TrustBadges = () => {
  const badges = [
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: '100% secure checkout',
    },
    {
      icon: '↩️',
      title: 'Easy Returns',
      description: '30-day return policy',
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Dedicated support',
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="text-4xl">{badge.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;

