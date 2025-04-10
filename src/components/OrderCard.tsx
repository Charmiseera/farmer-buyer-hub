
import React from 'react';
import { Order, OrderStatus } from '../types';
import { Check, Truck, Clock, XCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
  canUpdate?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, canUpdate = false }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get status icon
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'Confirmed':
        return <Check className="h-5 w-5 text-blue-500" />;
      case 'Delivered':
        return <Truck className="h-5 w-5 text-green-500" />;
      case 'Canceled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Get status color
  const getStatusColorClass = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="agri-card overflow-visible">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-agri-dark">
              Order #{order.id} • {formatDate(order.createdAt)}
            </h3>
            <p className="text-sm text-gray-600">
              {order.product?.cropName || 'Product'} ({order.quantityOrdered} {order.product?.unit})
            </p>
          </div>
          
          <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColorClass(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1">{order.status}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div>
            <p><span className="text-gray-500">Total:</span> <span className="font-medium">${order.totalPrice.toFixed(2)}</span></p>
            {order.farmerName && (
              <p><span className="text-gray-500">Farmer:</span> <span>{order.farmerName}</span></p>
            )}
            {order.buyerName && (
              <p><span className="text-gray-500">Buyer:</span> <span>{order.buyerName}</span></p>
            )}
          </div>
          
          {canUpdate && onUpdateStatus && (
            <div className="flex flex-col space-y-2">
              {order.status === 'Pending' && (
                <>
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'Confirmed')}
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-2 rounded transition-colors duration-200"
                  >
                    Confirm Order
                  </button>
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'Canceled')}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded transition-colors duration-200"
                  >
                    Cancel Order
                  </button>
                </>
              )}
              
              {order.status === 'Confirmed' && (
                <button 
                  onClick={() => onUpdateStatus(order.id, 'Delivered')}
                  className="text-xs bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-2 rounded transition-colors duration-200"
                >
                  Mark as Delivered
                </button>
              )}
              
              {order.status === 'Pending' && (
                <button 
                  onClick={() => onUpdateStatus(order.id, 'Canceled')}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded transition-colors duration-200"
                >
                  Cancel Order
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
