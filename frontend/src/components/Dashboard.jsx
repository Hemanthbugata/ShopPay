import React from 'react';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="dashboard-container">
      <h2>Successfully Logged In</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
