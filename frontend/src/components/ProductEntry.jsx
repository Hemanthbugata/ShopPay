import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; 

const ProductList = () => {
  const location = useLocation(); // Get the current location
  const productToEdit = location.state?.product || null; // Get the product data or null
  
  const [products, setProducts] = useState([]);
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
    if (productToEdit) {
      setFormData(productToEdit); // Pre-fill the form with the product data
      setIsEditing(true); // Set editing mode
    }
  }, [productToEdit]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
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
    setFormData(product);
    setIsEditing(true);
  };

  const handleDelete = async (Id) => {
    try {
      let mb = cookies.mobileNumber;
      let otp = cookies.otp;
      let role = cookies.role;

      await axios.delete(`http://localhost:5000/api/products/${Id}?mb=${mb}&otp=${otp}&role=${role}`);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.error);      
    }
  };

  return (
    <div className="product-entry-container">
      <h2>{isEditing ? 'Edit Product' : 'Create Product'}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="Id"
          placeholder="Product ID"
          value={formData.Id}
          onChange={handleInputChange}        
          disabled
        />
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          disabled
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <select name="variantType" value={formData.variantType} onChange={handleInputChange} required>
            <option value="">Select Variant Type</option>
            <option value="CHICKEN">Chicken</option>
            <option value="MUTTON">Mutton</option>
            <option value="PRAWNS">Prawns</option>
            <option value="GONGURA">Gongura</option>
            <option value="GONGURA CHICKEN">Gongura Chicken</option>
            <option value="GONGURA MUTTON">Gongura Mutton</option>
            <option value="GONGURA PRAWNS">Gongura Prawns</option>
        </select>
        <select name="variantWeight" value={formData.variantWeight} onChange={handleInputChange} required>
            <option value="">Select Variant Weight</option>
            <option value="Half kg">Half kg</option>
            <option value="1kg">1 kg</option>
        </select>
        <select name="variantOil" value={formData.variantOil} onChange={handleInputChange} required>
          <option value="">Select Oil Variant</option>
          <option value="CP_PO">Cold Pressed Peanut Oil</option>
          <option value="RO_PO">Refined Peanut Oil</option>
          <option value="CP_SO">Cold Pressed Sesame Oil</option>
        </select>
        <select name="variantSpicy" value={formData.variantSpicy} onChange={handleInputChange} required>
          <option value="">Select Spicy Variant</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="submit-button">
          {isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </form>

      <h2>Product List</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.Id} className="product-item">
            <div>
              <strong> {product.Id} - {product.name}</strong> - {product.description} - ₹ {product.price}
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

export default ProductList;