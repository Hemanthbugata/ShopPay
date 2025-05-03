import React, { useState } from 'react';
import ProductEntry from './ProductEntry';
// Import other components for stock input, employee creation, stock issue, etc.

const Dashboard = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState(' ');

  const renderContent = () => {
    switch (activeMenu) {
      case 'productEntry':
        return <ProductEntry />;
      case 'stockInput':
        return <div>Stock Input Component</div>; // Replace with actual StockInput component
      case 'employeeCreation':
        return <div>Employee Creation Component</div>; // Replace with actual EmployeeCreation component
      case 'stockIssue':
        return <div>Stock Issue Component</div>; // Replace with actual StockIssue component
      default:
        return <div>Select a menu option</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Dashboard</h1>
        <button onClick={onLogout}>Logout</button>
      </header>
      <nav>
        <ul>
          <li onClick={(OnProductEntry) => setActiveMenu('productEntry')}>Product Creation</li>
          <li onClick={() => setActiveMenu('stockInput')}>Stock Input</li>
          <li onClick={() => setActiveMenu('employeeCreation')}>Employee Creation</li>
          <li onClick={() => setActiveMenu('stockIssue')}>Stock Issue</li>
        </ul>
      </nav>
      <main>{renderContent()}</main>
    </div>
  );
};

export default Dashboard;