
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Product } from '../../types';
import { productService, orderService } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Truck, MapPin, ShoppingBag, X, Check, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const totalPrice = product ? (quantity * product.price) : 0;
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        
        if (data) {
          setProduct(data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (product && value > product.quantity) {
      setQuantity(product.quantity);
    } else {
      setQuantity(value);
    }
  };
  
  const openOrderModal = () => {
    if (!authState.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to place an order.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (authState.user?.role === 'farmer') {
      toast({
        title: "Cannot Place Order",
        description: "Farmers cannot place orders. Please login as a buyer.",
        variant: "destructive"
      });
      return;
    }
    
    setIsOrderModalOpen(true);
  };
  
  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setOrderSuccess(false);
  };
  
  const handlePlaceOrder = async () => {
    if (!product || !authState.user) return;
    
    try {
      setIsPlacingOrder(true);
      
      const orderData = {
        productId: product.id,
        buyerId: authState.user.id,
        buyerName: authState.user.name,
        farmerId: product.farmerId,
        farmerName: product.farmerName || 'Unknown Farmer',
        quantityOrdered: quantity,
        totalPrice: totalPrice
      };
      
      await orderService.createOrder(orderData);
      
      setOrderSuccess(true);
      
      // Reset form
      setQuantity(1);
      
      // Update product quantity
      setProduct(prev => {
        if (!prev) return null;
        return {
          ...prev,
          quantity: prev.quantity - quantity
        };
      });
      
      setTimeout(() => {
        closeOrderModal();
        navigate('/buyer-dashboard');
      }, 3000);
      
    } catch (err) {
      console.error('Error placing order:', err);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agri-green"></div>
        </div>
      ) : error ? (
        <div className="agri-container py-12">
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">{error}</h2>
            <p className="text-red-600 mb-4">The product you're looking for may have been removed or doesn't exist.</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="agri-button-primary"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      ) : product ? (
        <div className="agri-container py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-72 md:h-auto bg-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  src={product.image || 'https://via.placeholder.com/600x400?text=No+Image'} 
                  alt={product.cropName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                  }}
                />
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold text-agri-dark">{product.cropName}</h1>
                  <span className="bg-agri-light-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${product.price.toFixed(2)}/{product.unit}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {product.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Truck className="h-5 w-5 mr-2 text-agri-green" />
                    <span className="text-sm">
                      {product.quantity} {product.unit} available
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2 text-agri-green" />
                    <span className="text-sm">
                      Available until {formatDate(product.availableUntil)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-agri-green" />
                    <span className="text-sm">
                      From {product.farmerName} • {product.location}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity ({product.unit})
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="agri-input w-24 mr-3"
                    />
                    <span className="text-gray-600 text-sm">
                      Total: <span className="font-semibold">${(quantity * product.price).toFixed(2)}</span>
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={openOrderModal}
                  disabled={product.quantity === 0}
                  className={`agri-button-primary w-full flex items-center justify-center ${
                    product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {product.quantity === 0 ? 'Out of Stock' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Order Modal */}
      {isOrderModalOpen && product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-agri-dark">
                {orderSuccess ? 'Order Successful' : 'Confirm Your Order'}
              </h3>
              
              <button 
                onClick={closeOrderModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {orderSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-agri-dark mb-2">
                    Thank You for Your Order!
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Your order has been placed successfully. You will be redirected to your dashboard shortly.
                  </p>
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-agri-green mx-auto"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-medium text-agri-dark">Order Summary</h4>
                      <div className="mt-2 bg-gray-50 rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">{product.cropName}</span>
                          <span className="font-medium">${product.price.toFixed(2)}/{product.unit}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Quantity</span>
                          <span>{quantity} {product.unit}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-agri-dark">Delivery Information</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Please note that no real payment is processed. The farmer will arrange delivery after confirming your order.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="agri-button-primary w-full flex justify-center items-center"
                    >
                      {isPlacingOrder ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Confirm Order'
                      )}
                    </button>
                    
                    <button
                      onClick={closeOrderModal}
                      className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductDetailPage;
