
import { Product, Order, OrderStatus } from '../types';

// Mock products data
export const mockProducts: Product[] = [
  {
    id: '1',
    cropName: 'Organic Tomatoes',
    description: 'Fresh, organic tomatoes grown without pesticides.',
    quantity: 100,
    unit: 'kg',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1546470427-e26b1ec0ee5d',
    availableUntil: '2025-08-01',
    farmerId: '1',
    farmerName: 'John Farmer',
    location: 'Green Valley',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T10:30:00Z'
  },
  {
    id: '2',
    cropName: 'Sweet Corn',
    description: 'Locally grown sweet corn, perfect for summer barbecues.',
    quantity: 200,
    unit: 'dozen',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076',
    availableUntil: '2025-07-20',
    farmerId: '1',
    farmerName: 'John Farmer',
    location: 'Green Valley',
    createdAt: '2023-01-10T14:45:00Z',
    updatedAt: '2023-01-10T14:45:00Z'
  },
  {
    id: '3',
    cropName: 'Fresh Strawberries',
    description: 'Sweet, juicy strawberries picked at peak ripeness.',
    quantity: 50,
    unit: 'box',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6',
    availableUntil: '2025-06-25',
    farmerId: '2',
    farmerName: 'Sarah Fields',
    location: 'Sunny Hills',
    createdAt: '2023-01-05T09:15:00Z',
    updatedAt: '2023-01-05T09:15:00Z'
  },
  {
    id: '4',
    cropName: 'Organic Potatoes',
    description: 'Versatile, organic potatoes perfect for any dish.',
    quantity: 300,
    unit: 'kg',
    price: 1.49,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
    availableUntil: '2025-09-15',
    farmerId: '2',
    farmerName: 'Sarah Fields',
    location: 'Sunny Hills',
    createdAt: '2023-02-01T11:20:00Z',
    updatedAt: '2023-02-01T11:20:00Z'
  },
  {
    id: '5',
    cropName: 'Fresh Carrots',
    description: 'Crunchy, sweet carrots harvested daily.',
    quantity: 150,
    unit: 'kg',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1550082723-f93c351b339b',
    availableUntil: '2025-08-30',
    farmerId: '3',
    farmerName: 'Michael Gardens',
    location: 'River Bend',
    createdAt: '2023-02-10T13:40:00Z',
    updatedAt: '2023-02-10T13:40:00Z'
  },
  {
    id: '6',
    cropName: 'Green Lettuce',
    description: 'Crisp, leafy lettuce for fresh salads.',
    quantity: 75,
    unit: 'head',
    price: 1.29,
    image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9',
    availableUntil: '2025-07-10',
    farmerId: '3',
    farmerName: 'Michael Gardens',
    location: 'River Bend',
    createdAt: '2023-02-15T10:10:00Z',
    updatedAt: '2023-02-15T10:10:00Z'
  }
];

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: '1',
    productId: '1',
    buyerId: '4',
    buyerName: 'Alice Consumer',
    farmerId: '1',
    farmerName: 'John Farmer',
    quantityOrdered: 10,
    totalPrice: 29.90,
    status: 'Confirmed',
    createdAt: '2023-03-01T09:30:00Z',
    updatedAt: '2023-03-01T14:20:00Z'
  },
  {
    id: '2',
    productId: '3',
    buyerId: '4',
    buyerName: 'Alice Consumer',
    farmerId: '2',
    farmerName: 'Sarah Fields',
    quantityOrdered: 5,
    totalPrice: 19.95,
    status: 'Delivered',
    createdAt: '2023-03-05T13:45:00Z',
    updatedAt: '2023-03-07T11:30:00Z'
  },
  {
    id: '3',
    productId: '2',
    buyerId: '5',
    buyerName: 'Bob Shopper',
    farmerId: '1',
    farmerName: 'John Farmer',
    quantityOrdered: 3,
    totalPrice: 13.50,
    status: 'Pending',
    createdAt: '2023-03-10T10:15:00Z',
    updatedAt: '2023-03-10T10:15:00Z'
  }
];

// In-memory storage
let products = [...mockProducts];
let orders = [...mockOrders];

// Product services
export const productService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return [...products];
  },
  
  // Get products by farmer ID
  getProductsByFarmerId: async (farmerId: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return products.filter(product => product.farmerId === farmerId);
  },
  
  // Get product by ID
  getProductById: async (id: string): Promise<Product | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return products.find(product => product.id === id);
  },
  
  // Create new product
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newProduct: Product = {
      ...product,
      id: String(products.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    return newProduct;
  },
  
  // Update product
  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return undefined;
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return products[index];
  },
  
  // Delete product
  deleteProduct: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const initialLength = products.length;
    products = products.filter(product => product.id !== id);
    
    return products.length < initialLength;
  }
};

// Order services
export const orderService = {
  // Get orders by buyer ID
  getOrdersByBuyerId: async (buyerId: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return orders
      .filter(order => order.buyerId === buyerId)
      .map(order => ({
        ...order,
        product: products.find(p => p.id === order.productId)
      }));
  },
  
  // Get orders by farmer ID
  getOrdersByFarmerId: async (farmerId: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return orders
      .filter(order => order.farmerId === farmerId)
      .map(order => ({
        ...order,
        product: products.find(p => p.id === order.productId)
      }));
  },
  
  // Create new order
  createOrder: async (orderData: {
    productId: string;
    buyerId: string;
    buyerName: string;
    farmerId: string;
    farmerName: string;
    quantityOrdered: number;
    totalPrice: number;
  }): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newOrder: Order = {
      ...orderData,
      id: String(orders.length + 1),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    // Update product quantity
    const productIndex = products.findIndex(p => p.id === orderData.productId);
    if (productIndex !== -1) {
      products[productIndex].quantity -= orderData.quantityOrdered;
    }
    
    return newOrder;
  },
  
  // Update order status
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = orders.findIndex(order => order.id === orderId);
    if (index === -1) return undefined;
    
    orders[index] = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString()
    };
    
    return orders[index];
  },
  
  // Get order by ID
  getOrderById: async (id: string): Promise<Order | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const order = orders.find(order => order.id === id);
    
    if (order) {
      return {
        ...order,
        product: products.find(p => p.id === order.productId)
      };
    }
    
    return undefined;
  }
};
