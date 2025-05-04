import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductEntry = () => {
const [products, setProducts] = useState([]);
const navigate = useNavigate(); // Initialize navigate function
  const [formData, setFormData] = useState({
    Id: '',
    name: '',
    description: '',
    variantType: '',
    variantOil: '',
    variantSpicy: '',
    variantWeight: '',
    price: '',
    mobileNumber: '',
    otp: '',
    role: '', 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [cookies] = useCookies(['otp', 'mobileNumber', 'role']);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
  
    // Auto-generate product name based on variants
    const { variantType, variantWeight, variantOil, variantSpicy } = updatedFormData;
    if (variantType || variantWeight || variantOil || variantSpicy) {
      updatedFormData.name = `${variantType || ''} ${variantWeight || ''} ${variantOil || ''} ${variantSpicy || ''}`.trim();
    }
  
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        otp: cookies.otp,
        mobileNumber: cookies.mobileNumber,
        role: cookies.role,
      };

      console.log('Payload:', payload);

      if (isEditing) {
        // Update product         
        await axios.put(`http://localhost:5000/api/products/${formData.Id}`, payload);
        alert('Product updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/products', payload);
        alert('Product created successfully');
      }
      setFormData({ Id: '', name: '', description: '', variantOil: '', variantSpicy: '', price: '', variantType: '', variantWeight: '' });
      // Reset form data after submission
      setIsEditing(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    // Navigate to the product entry page with the product's data as state
    navigate('/product-entry', { state: { product } });
    //navigate('/product-entry', { state: { product } });
  };

  const handleDelete = async (Id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${Id}`);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="product-entry-container">
      <h2>Product List</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.Id} className="product-item">
            <div>
              <strong> {product.Id} - {product.name}</strong> - {product.description} - ${product.price}
            </div>
            <div>
              <button onClick={() => handleEdit(product)} className="edit-button">Edit</button>
              <button onClick={() => handleDelete(product.Id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductEntry;