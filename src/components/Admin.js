import React, { useState, useEffect } from "react";
import './Admin.css';

function Admin() {


  useEffect(() => {
    const auth = localStorage.getItem("adminLoggedIn");
    if (auth !== "true") {
      window.location.href = "/admin-login";
    }
  }, []);

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const [formData, setFormData] = useState({
    name: "", price: "", description: "", category: "storage", image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['storage', 'gpu', 'cpu', 'motherboards', 'other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('id', Date.now());
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('category', formData.category);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        body: data // No Content-Type header needed for FormData
      });

      if (response.ok) {
        fetchProducts(); // Refresh list
        setFormData({ name: "", price: "", description: "", category: "storage", image: null });
        setImagePreview('');
        alert("Product added successfully!");
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product", error);
      alert("Error adding product");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/messages/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchMessages();
      } else {
        alert("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message", error);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      <button className="back-btn" onClick={() => {
        localStorage.removeItem("adminLoggedIn");
        window.location.href = "/admin-login";
      }}>
        Logout
      </button>

      <div className="admin-form-section">
        <h2>Add Product</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Product Name"
            value={formData.name} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price" step="0.01"
            value={formData.price} onChange={handleChange} required />
          <textarea name="description" placeholder="Description"
            value={formData.description} onChange={handleChange} required />
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label className="image-upload-label" htmlFor="img">Upload Image</label>
          <input id="img" type="file" accept="image/*" onChange={handleImageChange} required />

          {imagePreview && <img src={imagePreview} className="preview" alt="preview" />}

          <button type="submit">Add Product</button>
        </form>
      </div>

      <div className="products-list-section">
        <h2>Products ({products.length})</h2>
        <div className="products-grid">
          {products.map(p => (
            <div key={p.id} className="product-item">
              <img src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{p.category}</p>
              <strong>${p.price}</strong>
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="products-list-section">
        <h2>Messages ({messages.length})</h2>
        <div className="products-grid">
          {messages.map(msg => (
            <div key={msg.id} className="product-item">
              <h3>{msg.name}</h3>
              <p>{msg.email}</p>
              <p>{msg.message}</p>
              <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Admin;
