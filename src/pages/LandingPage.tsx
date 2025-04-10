
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Tractor, ShoppingBag, Sprout, TrendingUp } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { state } = useAuth();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-agri-green to-agri-light-green text-white">
        <div className="agri-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Fresh from Farm <br /> Direct to You
              </h1>
              <p className="text-lg mb-8 max-w-md">
                AgriConnect bridges the gap between farmers and consumers. 
                Better prices for farmers, fresher produce for you.
              </p>
              
              {state.isAuthenticated ? (
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  {state.user?.role === 'farmer' ? (
                    <Link 
                      to="/farmer-dashboard" 
                      className="bg-white text-agri-green hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition-colors duration-200 text-center"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/marketplace" 
                      className="bg-white text-agri-green hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition-colors duration-200 text-center"
                    >
                      Browse Marketplace
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    to="/register"
                    className="bg-white text-agri-green hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition-colors duration-200 text-center"
                  >
                    Join AgriConnect
                  </Link>
                  <Link 
                    to="/login"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-md transition-colors duration-200 text-center"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
            
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1623244307563-d5ba345a4776?w=600&h=400&fit=crop" 
                alt="Farmer with produce" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="agri-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-agri-dark mb-4">How AgriConnect Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to connect farmers with buyers, creating a more sustainable and efficient food system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="bg-agri-green/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Tractor className="h-8 w-8 text-agri-green" />
              </div>
              <h3 className="text-xl font-semibold text-agri-dark mb-2">Farmers List Products</h3>
              <p className="text-gray-600">
                Farmers add their available crops, set their own prices, and manage their inventory.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="bg-agri-orange/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-agri-orange" />
              </div>
              <h3 className="text-xl font-semibold text-agri-dark mb-2">Buyers Browse & Order</h3>
              <p className="text-gray-600">
                Buyers explore available products, place orders, and communicate directly with farmers.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="bg-agri-light-green/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8 text-agri-light-green" />
              </div>
              <h3 className="text-xl font-semibold text-agri-dark mb-2">Fresh Food Delivered</h3>
              <p className="text-gray-600">
                Farmers fulfill orders, ensuring you get the freshest produce straight from the source.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-agri-cream">
        <div className="agri-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-agri-dark mb-6">
                Why Choose AgriConnect?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-agri-green/10 rounded-full p-2 mr-4 mt-1">
                    <TrendingUp className="h-5 w-5 text-agri-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-agri-dark mb-1">Better Prices</h3>
                    <p className="text-gray-600">
                      Farmers earn more by selling directly to consumers, while buyers pay less by cutting out middlemen.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-agri-green/10 rounded-full p-2 mr-4 mt-1">
                    <Sprout className="h-5 w-5 text-agri-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-agri-dark mb-1">Fresher Produce</h3>
                    <p className="text-gray-600">
                      Shorter supply chains mean produce gets from farm to table faster, ensuring maximum freshness.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-agri-green/10 rounded-full p-2 mr-4 mt-1">
                    <Tractor className="h-5 w-5 text-agri-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-agri-dark mb-1">Support Local Farming</h3>
                    <p className="text-gray-600">
                      Your purchases directly support local farmers and sustainable agricultural practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&h=500&fit=crop" 
                alt="Fresh produce" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-agri-dark text-white">
        <div className="agri-container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform How You Buy and Sell Food?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and buyers already using AgriConnect to create a more sustainable food system.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/register"
              className="bg-agri-green hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200"
            >
              Join as a Farmer
            </Link>
            <Link 
              to="/register"
              className="bg-agri-orange hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200"
            >
              Join as a Buyer
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
