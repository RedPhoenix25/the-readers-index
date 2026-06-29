import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './CartDrawer.css';

export default function CartDrawer() {
  const { user } = useAuth();
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal 
  } = useCart();
  
  const navigate = useNavigate();
  const location = useLocation();

  if (!isCartOpen) return null;

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'GBP': return '£';
      case 'USD': return '$';
      case 'NGN': return '₦';
      default: return '₦';
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      navigate('/login?redirect=/shop/checkout');
    } else {
      navigate('/shop/checkout');
    }
  };

  return (
    <>
      <div className="cart-backdrop" onClick={() => setIsCartOpen(false)} />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={48} opacity={0.5} />
              <p>Your cart is empty.</p>
              <button className="btn btn-secondary" onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <img src={item.images?.[0] || 'https://via.placeholder.com/80'} alt={item.title} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.title}</h4>
                    <p className="cart-item-price">
                      {getCurrencySymbol(item.currency)}{item.price.toFixed(2)}
                    </p>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus size={14} /></button>
                      </div>
                      <button className="remove-item-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>{getCurrencySymbol(cartItems[0]?.currency || 'NGN')}{getCartTotal().toFixed(2)}</span>
            </div>
            <p className="cart-shipping-note">Shipping and taxes calculated at checkout.</p>
            <button className="btn btn-primary btn-checkout" onClick={handleCheckout}>
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
