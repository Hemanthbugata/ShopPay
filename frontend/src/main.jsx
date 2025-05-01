import { StrictMode } from 'react';  // Import StrictMode to help with development
import { createRoot } from 'react-dom/client';  // Import createRoot for React 18
import './index.css';  // Import global CSS styles
import App from './App';  // Import the main App component

// Create the root element and render the app inside it
const root = createRoot(document.getElementById('root'));  // Ensure there's a <div id="root"></div> in your index.html
root.render(
  <StrictMode>
    <App />  {/* Render the App component */}
  </StrictMode>,
);
