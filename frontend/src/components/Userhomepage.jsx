import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAccount from './UserAccount';
import UserProducts from './UserProducts';
import '../styles/Userhomepage.css';


const UserhomePage = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'account':
        return < UserAccount />;        
      case 'products':
        return < UserProducts />;
      case 'cart':
        return <div>Add to Cart</div>;
      case 'placeOrder':
        return <div>Place order</div>;
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>MyFoods Products</h1>
        <nav>
          <ul className="nav-links">
            <li onClick={() => setActiveMenu('account')}>User Account</li>
            <li onClick={() => setActiveMenu('products')}>Products</li>
            <li onClick={() => setActiveMenu('cart')}>Add to Cart</li>
            <li onClick={() => setActiveMenu('placeOrder')}>Place Order</li>
            <li className="logout-link" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </nav>
      </header>
      <main>{renderContent()}</main>
    </div>
  );
};

export default UserhomePage;