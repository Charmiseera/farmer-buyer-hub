
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Calendar, MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showFarmerInfo?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showFarmerInfo = true }) => {
  // Format price to 2 decimal places
  const formattedPrice = product.price.toFixed(2);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="agri-card h-full flex flex-col">
      <div className="h-48 overflow-hidden bg-gray-200">
        <img 
          src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={product.cropName} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-agri-dark">{product.cropName}</h3>
          <span className="bg-agri-light-green text-white text-xs font-bold px-2 py-1 rounded-full">
            ${formattedPrice}/{product.unit}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Available until: {formatDate(product.availableUntil)}</span>
          </div>
          
          {showFarmerInfo && product.farmerName && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{product.farmerName} • {product.location}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-medium text-gray-700">
              {product.quantity} {product.unit} available
            </span>
            <Link 
              to={`/product/${product.id}`} 
              className="text-agri-green font-medium text-sm hover:text-green-700 transition-colors"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
