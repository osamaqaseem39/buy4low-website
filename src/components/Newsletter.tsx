import { useState } from 'react';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thanks for subscribing!');
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-4">Stay Updated</h2>
          <p className="text-xl text-white/90 mb-8">
            Subscribe to our newsletter for exclusive deals and new product updates
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-gray-100 transition-colors text-lg"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

