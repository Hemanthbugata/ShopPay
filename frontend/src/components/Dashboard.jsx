import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductEntry from './ProductEntry';
import ProductList from './ProductList';

const Dashboard = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'productEntry':
        return <ProductEntry />;
        case 'productList':
          return <ProductList />;  
      case 'stockInput':
        return <div>Stock Input Component</div>;
      case 'employeeCreation':
        return <div>Employee Creation Component</div>;
      case 'stockIssue':
        return <div>Stock Issue Component</div>;
      default:
        return <div>Select a menu option</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Cockpit</h1>
        <nav>
          <ul className="nav-links">
            <li onClick={() => setActiveMenu('productEntry')}>Product Creation</li>
            <li onClick={() => setActiveMenu('productList')}>Product List</li>
            <li onClick={() => setActiveMenu('stockInput')}>Stock Input</li>
            <li onClick={() => setActiveMenu('employeeCreation')}>Employee Creation</li>
            <li onClick={() => setActiveMenu('stockIssue')}>Stock Issue</li>
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

export default Dashboard;