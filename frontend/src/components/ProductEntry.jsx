import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
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
    mobileNumber: '',
    otp: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [cookies] = useCookies(['otp', 'mobileNumber']);

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
        otp: cookies.otp,
        mobileNumber: cookies.mobileNumber,
      };

      console.log('Payload:', payload);

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${formData.id}`, payload);
        alert('Product updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/products', payload);
        alert('Product created successfully');
      }
      setFormData({ id: '', name: '', description: '', variantOil: '', variantSpicy: '', price: '' });
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
      <form onSubmit={handleSubmit} className="product-form">
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
        <button type="submit" className="submit-button">
          {isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </form>

      <h2>Product List</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <div>
              <strong>{product.name}</strong> - {product.description} - ${product.price}
            </div>
            <div>
              <button onClick={() => handleEdit(product)} className="edit-button">Edit</button>
              <button onClick={() => handleDelete(product.id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductEntry;