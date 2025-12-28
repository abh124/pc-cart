import React, { useState, useEffect } from "react";
import Product from './Product';
import './Chopnavbar.css';

function Chopnavbar() {
  const [activeSection, setActiveSection] = useState('storage');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products", err));
  }, []);

  const sections = [
    { id: 'storage', name: 'Storage Units' },
    { id: 'gpu', name: 'GPU' },
    { id: 'cpu', name: 'CPU' },
    { id: 'motherboards', name: 'Motherboards' },
    { id: 'other', name: 'Other' }
  ];

  const filteredProducts = products.filter(product => product.category === activeSection);

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert('Product added to cart!');
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleQuantityChange = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="chopnavbar-container">
      <nav className="navbar">
        <div className="navbar-brand">Chop</div>
        <ul className="navbar-menu">
          {sections.map(section => (
            <li
              key={section.id}
              className={activeSection === section.id ? 'active' : ''}
              onClick={() => setActiveSection(section.id)}
            >
              {section.name}
            </li>
          ))}
        </ul>
        <button className="cart-button" onClick={() => setShowCart(!showCart)}>
          🛒 Cart ({cart.length})
        </button>
      </nav>

      <div className="content-area">
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <Product
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <h2>No products available in this category</h2>
          </div>
        )}
      </div>

      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Shopping Cart</h2>
              <button className="close-cart" onClick={() => setShowCart(false)}>✕</button>
            </div>

            {cart.length > 0 ? (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p className="cart-item-price">${item.price}</p>
                      </div>
                      <div className="cart-item-quantity">
                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <h3>Total: ${getTotalPrice()}</h3>
                  <button className="checkout-btn" onClick={() => window.open("https://wa.me/96170141203", "_blank")}>
                    Checkout
                  </button>
                </div>
              </>
            ) : (
              <p className="empty-cart">Your cart is empty</p>
            )}
          </div>
        </div>
      )}

      <button className="back-home" onClick={() => window.location.href = '/'}>
        Back to Home
      </button>
    </div>
  );
}

export default Chopnavbar;