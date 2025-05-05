import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import '../styles/UserProducts.css';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cookies] = useCookies(['mobileNumber', 'otp', 'role']);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products', {
          params: {
            mobileNumber: cookies.mobileNumber,
            otp: cookies.otp,
            role: cookies.role,
          },
        });
        setProducts(response.data.products);

        // Initialize quantities for each product
        const initialQuantities = {};
        response.data.products.forEach((product) => {
          initialQuantities[product.Id] = 0;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
      }
    };

    fetchProducts();
  }, [cookies]);

  // Handle quantity increment
  const handleIncrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] + 1,
    }));
  };

  // Handle quantity decrement
  const handleDecrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(prevQuantities[productId] - 1, 0), // Ensure quantity doesn't go below 0
    }));
  };

  return (
    <div className="user-products-container">
      <h2>Our Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.Id} className="product-card">
            <img
              src={product.image || './public/images/products/product1.png'} // Placeholder image if no image is provided
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">₹ {product.price}</p>
            <div className="quantity-controls">
              <button
                className="quantity-button"
                onClick={() => handleDecrement(product.Id)}
              >
                -
              </button>
              <span className="quantity">{quantities[product.Id]}</span>
              <button
                className="quantity-button"
                onClick={() => handleIncrement(product.Id)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProducts;