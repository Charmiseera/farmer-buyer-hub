
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import OrderCard from '../../components/OrderCard';
import { useAuth } from '../../contexts/AuthContext';
import { Order, OrderStatus } from '../../types';
import { orderService } from '../../services/mockData';
import { ShoppingBag, Clock, Check, Truck, XCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const BuyerDashboardPage: React.FC = () => {
  const { state: authState } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'canceled'>('active');
  const { toast } = useToast();
  
  // Computed order arrays
  const activeOrders = orders.filter(order => ['Pending', 'Confirmed'].includes(order.status));
  const completedOrders = orders.filter(order => order.status === 'Delivered');
  const canceledOrders = orders.filter(order => order.status === 'Canceled');
  
  // Stats
  const totalSpent = orders
    .filter(order => order.status === 'Delivered')
    .reduce((sum, order) => sum + order.totalPrice, 0);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!authState.user) return;
      
      try {
        setLoading(true);
        const data = await orderService.getOrdersByBuyerId(authState.user.id);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast({
          title: "Error Loading Orders",
          description: "There was a problem loading your order history.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [authState.user, toast]);
  
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      toast({
        title: "Order Updated",
        description: `Order #${orderId} has been ${status === 'Canceled' ? 'canceled' : 'updated'}.`,
        variant: "default"
      });
    } catch (err) {
      console.error('Error updating order status:', err);
      toast({
        title: "Update Failed",
        description: "There was a problem updating the order.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-agri-orange to-amber-500 py-8 px-4">
        <div className="agri-container">
          <h1 className="text-3xl font-bold text-white mb-2">Buyer Dashboard</h1>
          <p className="text-white/90">
            Manage your orders and track deliveries from farmers.
          </p>
        </div>
      </div>
      
      <div className="agri-container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="bg-amber-100 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Orders</p>
                <h3 className="text-2xl font-bold text-agri-dark">{activeOrders.length}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Completed Orders</p>
                <h3 className="text-2xl font-bold text-agri-dark">{completedOrders.length}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <h3 className="text-2xl font-bold text-agri-dark">${totalSpent.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>
        
        {/* Browse Marketplace Button */}
        <div className="mb-8">
          <Link 
            to="/marketplace" 
            className="bg-agri-orange hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 inline-flex items-center"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Browse Marketplace
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'active'
                  ? 'border-agri-orange text-agri-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              Active Orders
              {activeOrders.length > 0 && (
                <span className="ml-2 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                  {activeOrders.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'completed'
                  ? 'border-agri-orange text-agri-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Truck className="h-4 w-4 inline mr-2" />
              Completed
            </button>
            
            <button
              onClick={() => setActiveTab('canceled')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'canceled'
                  ? 'border-agri-orange text-agri-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <XCircle className="h-4 w-4 inline mr-2" />
              Canceled
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agri-orange"></div>
          </div>
        ) : (
          <>
            {activeTab === 'active' && (
              activeOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Active Orders</h3>
                  <p className="text-gray-500 mb-6">You don't have any pending or confirmed orders.</p>
                  <Link to="/marketplace" className="bg-agri-orange hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
                    Browse Marketplace
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onUpdateStatus={handleUpdateOrderStatus}
                      canUpdate={order.status === 'Pending'}
                    />
                  ))}
                </div>
              )
            )}
            
            {activeTab === 'completed' && (
              completedOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Completed Orders</h3>
                  <p className="text-gray-500">You don't have any delivered orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )
            )}
            
            {activeTab === 'canceled' && (
              canceledOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Canceled Orders</h3>
                  <p className="text-gray-500">You don't have any canceled orders.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {canceledOrders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default BuyerDashboardPage;
