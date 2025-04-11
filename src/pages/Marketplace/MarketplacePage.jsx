import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { productService } from '../../services';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCropTypes, setSelectedCropTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Derived/computed states
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cropTypes, setCropTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
        
        // Extract unique crop types and locations for filters
        const types = Array.from(new Set(data.map(product => product.cropName.split(' ')[0])));
        const locs = Array.from(new Set(data.map(product => product.location || '').filter(Boolean)));
        
        setCropTypes(types);
        setLocations(locs);
        
        // Find max price for range slider
        const maxPrice = Math.max(...data.map(product => product.price), 100);
        setPriceRange([0, maxPrice]);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      let results = [...products];
      
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          product => 
            product.cropName.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term)
        );
      }
      
      // Apply crop type filter
      if (selectedCropTypes.length > 0) {
        results = results.filter(product => 
          selectedCropTypes.some(type => 
            product.cropName.toLowerCase().includes(type.toLowerCase())
          )
        );
      }
      
      // Apply location filter
      if (selectedLocations.length > 0) {
        results = results.filter(product => 
          product.location && selectedLocations.includes(product.location)
        );
      }
      
      // Apply price range filter
      results = results.filter(
        product => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      
      setFilteredProducts(results);
    };
    
    applyFilters();
  }, [products, searchTerm, selectedCropTypes, selectedLocations, priceRange]);
  
  const toggleCropType = (type) => {
    setSelectedCropTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const toggleLocation = (location) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCropTypes([]);
    setSelectedLocations([]);
    setPriceRange([0, Math.max(...products.map(product => product.price), 100)]);
  };
  
  const activeFilterCount = (selectedCropTypes.length + selectedLocations.length + (searchTerm ? 1 : 0));
  
  return (
    <Layout>
      <div className="bg-gradient-to-r from-agri-green to-agri-light-green py-8 px-4">
        <div className="agri-container">
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-white/90 max-w-2xl">
            Browse fresh, locally grown produce directly from farmers. Filter by crop type, location, or price to find exactly what you need.
          </p>
        </div>
      </div>
      
      <div className="agri-container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="agri-input pl-10 w-full"
            />
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(prev => !prev)}
              className="flex items-center space-x-2 text-sm font-medium text-agri-dark px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 bg-agri-green text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="ml-2 text-sm text-agri-green hover:text-green-700 flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Crop Type</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cropTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCropTypes.includes(type)}
                      onChange={() => toggleCropType(type)}
                      className="h-4 w-4 text-agri-green rounded focus:ring-agri-green"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Location</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {locations.map(location => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => toggleLocation(location)}
                      className="h-4 w-4 text-agri-green rounded focus:ring-agri-green"
                    />
                    <span className="ml-2 text-sm text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Price Range</h3>
              <div className="px-2">
                <input
                  type="range"
                  min={0}
                  max={Math.max(...products.map(product => product.price), 100)}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0].toFixed(2)}</span>
                  <span>${priceRange[1].toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agri-green"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No products match your filters</div>
            <button
              onClick={clearFilters}
              className="agri-button-primary text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MarketplacePage;
