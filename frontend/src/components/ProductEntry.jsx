import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie'; // Import useCookies
import axios from 'axios';

const ProductEntry = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    variantOil: '',
    variantSpicy: '',
    price: '',
    mobileNumber: '', // Add mobileNumber to formData
    otp: '', // Add otp to formData
  });
  const [isEditing, setIsEditing] = useState(false);
  const [cookies] = useCookies(['otp', 'mobileNumber']); // Read cookies
  // Fetch products on component mount
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            ...formData,
            otp: cookies.otp, // Add OTP from cookies
            mobileNumber: cookies.mobileNumber, // Add mobile number from cookies
          };
    
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${formData.id}`, formData);
        alert('Product updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/products', formData);
        alert('Product created successfully');
      }
      setFormData({ id: '', name: '', description: '', variantOil: '', variantSpicy: '', price: '' });
      setIsEditing(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="product-entry-container">
      <h2>{isEditing ? 'Edit Product' : 'Create Product'}</h2>
      <form onSubmit={handleSubmit}>
      <input
          type="text"
          name="id"
          placeholder="Product ID"
          value={formData.id}
          onChange={handleInputChange}
          required
          disabled
        /> 
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
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
        <button type="submit">{isEditing ? 'Update Product' : 'Create Product'}</button>
      </form>

      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> - {product.description} - ${product.price}
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductEntry;