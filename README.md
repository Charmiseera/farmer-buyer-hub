
# AgriConnect

AgriConnect is an Agricultural Product Marketplace that connects farmers directly with buyers.

## Setup Instructions

### Backend Setup
1. Navigate to the project directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start the backend server:
   ```
   node src/server/index.js
   ```
   The server will run on port 5000.

### Frontend Setup
1. In a separate terminal, navigate to the project directory
2. Start the React development server:
   ```
   npm run dev
   ```
   The frontend will run on port 3000.

## MongoDB Connection
The application connects to MongoDB Atlas with the following connection string:
```
mongodb+srv://techyguides8:tCUYecjIdwGgP0Oo@cluster0.xnbcp.mongodb.net/agriconnect?retryWrites=true&w=majority&appName=Cluster0
```

## Features
- User authentication (register/login) for farmers and buyers
- Product listings by farmers
- Marketplace for buyers to browse and order products
- Order management system
- Dashboards for both farmers and buyers

## Technology Stack
- Frontend: React, TailwindCSS
- Backend: Node.js, Express
- Database: MongoDB Atlas

