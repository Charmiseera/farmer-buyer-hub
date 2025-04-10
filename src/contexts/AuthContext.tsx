
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, UserRole } from '../types';

// Define available actions
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', 'dummy-token-will-be-replaced');
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Create auth context
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, location: string, phone: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Mock auth methods - these will be replaced with actual API calls
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // For demo, we'll create a mock user based on email
      const role: UserRole = email.includes('farmer') ? 'farmer' : 'buyer';
      
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email,
        role,
        location: 'Sample Location',
        phone: '555-123-4567'
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Invalid credentials' });
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, location: string, phone: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Create a mock user
      const mockUser: User = {
        id: '1',
        name,
        email,
        role,
        location,
        phone
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Registration failed' });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check for token on initial load
  useEffect(() => {
    // This would normally verify the JWT with the backend
    const token = localStorage.getItem('token');
    
    if (token) {
      // For demo, we'll create a mock user
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: 'user@example.com',
        role: 'farmer',
        location: 'Sample Location',
        phone: '555-123-4567'
      };
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
