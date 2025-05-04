import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        return <div>Account Details Component</div>;
      case 'cart':
        return <div>Cart Component</div>;
      case 'createOrder':
        return <div>Create Order Component</div>;
      default:
        return <div>Select a menu option</div>;
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to ShopPay</h1>
        <nav>
          <ul className="nav-links">
            <li onClick={() => setActiveMenu('account')}>Account</li>
            <li onClick={() => setActiveMenu('cart')}>Cart</li>
            <li onClick={() => setActiveMenu('createOrder')}>Create Order</li>
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