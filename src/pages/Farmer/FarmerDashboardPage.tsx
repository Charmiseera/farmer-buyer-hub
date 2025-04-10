
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import OrderCard from '../../components/OrderCard';
import { useAuth } from '../../contexts/AuthContext';
import { Product, Order, OrderStatus } from '../../types';
import { productService, orderService } from '../../services/mockData';
import { Plus, PackageOpen, Tractor, DollarSign, ShoppingBag } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const FarmerDashboardPage: React.FC = () => {
  const { state: authState } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const { toast } = useToast();
  
  const earnings = orders
    .filter(order => order.status !== 'Canceled')
    .reduce((sum, order) => sum + order.totalPrice, 0);
  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authState.user) return;
      
      try {
        setLoading(true);
        
        const [productsData, ordersData] = await Promise.all([
          productService.getProductsByFarmerId(authState.user.id),
          orderService.getOrdersByFarmerId(authState.user.id)
        ]);
        
        setProducts(productsData);
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your dashboard data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
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
        description: `Order #${orderId} has been marked as ${status}.`,
        variant: "default"
      });
    } catch (err) {
      console.error('Error updating order status:', err);
      toast({
        title: "Update Failed",
        description: "There was a problem updating the order status.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      await productService.deleteProduct(productId);
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productId)
      );
      
      toast({
        title: "Product Deleted",
        description: "Your product has been removed from the marketplace.",
        variant: "default"
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      toast({
        title: "Deletion Failed",
        description: "There was a problem deleting the product.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-agri-green to-agri-light-green py-8 px-4">
        <div className="agri-container">
          <h1 className="text-3xl font-bold text-white mb-2">Farmer Dashboard</h1>
          <p className="text-white/90">
            Manage your product listings and track orders from buyers.
          </p>
        </div>
      </div>
      
      <div className="agri-container py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="bg-agri-green/10 p-3 rounded-full mr-4">
                <Tractor className="h-6 w-6 text-agri-green" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <h3 className="text-2xl font-bold text-agri-dark">{products.length}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <PackageOpen className="h-6 w-6 text-agri-orange" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Orders</p>
                <h3 className="text-2xl font-bold text-agri-dark">
                  {totalOrders} <span className="text-sm font-normal text-orange-500">({pendingOrders} pending)</span>
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Earnings</p>
                <h3 className="text-2xl font-bold text-agri-dark">${earnings.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Product Button */}
        <div className="mb-8">
          <Link 
            to="/add-product" 
            className="agri-button-primary inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Product
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'products'
                  ? 'border-agri-green text-agri-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Tractor className="h-4 w-4 inline mr-2" />
              My Products
            </button>
            
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'orders'
                  ? 'border-agri-green text-agri-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingBag className="h-4 w-4 inline mr-2" />
              Orders
              {pendingOrders > 0 && (
                <span className="ml-2 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                  {pendingOrders}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agri-green"></div>
          </div>
        ) : (
          <>
            {activeTab === 'products' ? (
              products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Tractor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Products Listed</h3>
                  <p className="text-gray-500 mb-6">You haven't added any products to the marketplace yet.</p>
                  <Link to="/add-product" className="agri-button-primary">
                    Add Your First Product
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="relative">
                      <ProductCard product={product} showFarmerInfo={false} />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Link
                          to={`/edit-product/${product.id}`}
                          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Orders Yet</h3>
                  <p className="text-gray-500">You haven't received any orders yet. Make sure your products are listed in the marketplace.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onUpdateStatus={handleUpdateOrderStatus}
                      canUpdate={true}
                    />
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

export default FarmerDashboardPage;
