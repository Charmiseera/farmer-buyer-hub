
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, LogOut, ShoppingCart, Tractor, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="agri-container py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Tractor className="h-8 w-8 text-agri-green" />
              <span className="text-xl font-bold text-agri-dark">AgriConnect</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-agri-green transition-colors">
                Home
              </Link>
              
              {state.isAuthenticated ? (
                state.user?.role === 'buyer' ? (
                  <>
                    <Link to="/marketplace" className="text-gray-600 hover:text-agri-green transition-colors">
                      Marketplace
                    </Link>
                    <Link to="/buyer-dashboard" className="text-gray-600 hover:text-agri-green transition-colors">
                      My Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/farmer-dashboard" className="text-gray-600 hover:text-agri-green transition-colors">
                      My Dashboard
                    </Link>
                    <Link to="/add-product" className="text-gray-600 hover:text-agri-green transition-colors">
                      Add Product
                    </Link>
                  </>
                )
              ) : (
                <>
                  <Link to="/about" className="text-gray-600 hover:text-agri-green transition-colors">
                    About
                  </Link>
                  <Link to="/contact" className="text-gray-600 hover:text-agri-green transition-colors">
                    Contact
                  </Link>
                </>
              )}
            </nav>
            
            <div className="flex items-center space-x-4">
              {state.isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-agri-dark" />
                    <span className="text-sm font-medium text-agri-dark">
                      {state.user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-agri-green transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-sm font-medium text-agri-green hover:text-green-700 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="agri-button-primary text-sm px-3 py-1.5">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow bg-agri-cream">
        {children}
      </main>
      
      <footer className="bg-agri-dark text-white py-8">
        <div className="agri-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AgriConnect</h3>
              <p className="text-gray-300 text-sm">
                Connecting farmers directly with buyers for fresher produce and fairer prices.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white text-sm transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="text-gray-300 text-sm not-italic">
                1234 Farm Road<br />
                Green Valley, CA 94580<br />
                Email: info@agriconnect.com<br />
                Phone: (555) 123-4567
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} AgriConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
