import { useQuery } from 'react-query';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { Order } from '../types';

const Orders = () => {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery('my-orders', async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  });

  const orders: Order[] = data?.data || [];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card text-center">
          <p className="text-gray-600 mb-4">Please login to view your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">You have no orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">Order #{order._id.slice(-8)}</h3>
                  <p className="text-gray-600 text-sm">
                    Placed on{' '}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                      order.orderStatus === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.orderStatus === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.orderStatus.charAt(0).toUpperCase() +
                      order.orderStatus.slice(1)}
                  </span>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Payment Status:</strong>{' '}
                  <span className="capitalize">{order.paymentStatus}</span>
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Payment Method:</strong>{' '}
                  {order.paymentMethod.replace('_', ' ').replace(/\b\w/g, (l) =>
                    l.toUpperCase()
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

