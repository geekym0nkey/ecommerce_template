// src/App.jsx

import React from 'react';
// Import router components
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import page components
import ProductListPage from './pages/ProductListPage';
import LoginPage from './pages/LoginPage';
import OrderPage from './pages/OrderPage'
import ShippingScreen from './pages/ShippingScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
import ProfileScreen from './pages/ProfileScreen'
import Header from './pages/Header';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        {/* Route for '/': Home page, displays the product list */}
        <Route path='/' element={<ProductListPage />} />
        
        {/* Route for '/login': Login page, displays the login form */}
        <Route path='/login' element={<LoginPage />} />

        <Route path="/order/:id" element={<OrderPage />} />

        <Route path="/shipping" element={<ShippingScreen />} />

        <Route path="/placeorder" element={<PlaceOrderScreen />} />

        <Route path='/profile' element={<ProfileScreen />} />

      </Routes>
    </Router>
  );
}

export default App; 
