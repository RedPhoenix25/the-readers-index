import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Check, ArrowLeft, Loader, Copy } from 'lucide-react';
import { createOrder } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Shop.css';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    if (orderSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [orderSuccess]);

  if (!orderSuccess && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="shop-page page-transition">
        <div className="shop-empty">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn btn-primary">Return to Shop</Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      customerEmail: formData.email,
      products: cartItems.map(item => ({ product: item._id, quantity: item.quantity, priceAtPurchase: item.price })),
      totalAmount: getCartTotal(),
      shippingAddress: {
        fullName: formData.name,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }
    };

    try {
      const newOrder = await createOrder(orderData, token);
      setOrderSuccess({
        id: newOrder._id,
        items: [...cartItems],
        total: getCartTotal(),
        shipping: formData
      });
      clearCart();
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'GBP': return '£';
      case 'USD': return '$';
      case 'NGN': return '₦';
      default: return '₦';
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-page page-transition">
        <div className="checkout-success glass-card animate-scale-in" style={{ padding: 'var(--space-3xl)', textAlign: 'center', maxWidth: '600px', margin: '4rem auto' }}>
          <div className="checkout-success-icon" style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Check size={40} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Your mock order has been placed successfully and is now pending.
          </p>
          <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Order ID</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-gold)' }}>
                  {orderSuccess.id.substring(0, 8)}
                </p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(orderSuccess.id.substring(0, 8));
                    toast.success('Order ID copied!');
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  title="Copy Order ID"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            
            <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Order Summary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {orderSuccess.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>{item.quantity}x {item.title}</span>
                    <span style={{ fontWeight: 500 }}>{getCurrencySymbol(item.currency)}{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--accent-gold)' }}>₦{orderSuccess.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Link to="/my-archive?tab=orders" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            Track Your Order
          </Link>
          <Link to="/shop" className="btn btn-secondary" style={{ width: '100%' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page page-transition">
      <div className="checkout-header animate-fade-in">
        <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Shop
        </Link>
        <h1>Mock Checkout</h1>
        <p>This is a simulated checkout. No payment is required.</p>
      </div>

      <div className="checkout-form-card glass-card animate-slide-up">
        <div className="checkout-summary" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item._id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {item.images?.[0] ? (
                <img src={item.images[0]} alt={item.title} style={{ width: '50px', height: '50px' }} />
              ) : (
                <div style={{ width: '50px', height: '50px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }} />
              )}
              <div className="checkout-summary-details">
                <h4 style={{ fontSize: '0.9rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem' }}>Qty: {item.quantity}</p>
              </div>
              <div style={{ marginLeft: 'auto', fontWeight: '500', color: 'var(--accent-gold)' }}>
                {getCurrencySymbol(item.currency)}{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group full">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="form-group full">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group full">
            <label>Street Address</label>
            <input type="text" name="street" value={formData.street} onChange={handleInputChange} required />
          </div>
          <div className="checkout-form-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>State / Province</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="checkout-form-row">
            <div className="form-group">
              <label>Zip / Postal Code</label>
              <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="checkout-total">
            <span>Total to pay:</span>
            <span style={{ color: 'var(--accent-gold)' }}>
              {getCurrencySymbol(cartItems[0]?.currency || 'NGN')}{getCartTotal().toFixed(2)}
            </span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: 'var(--space-md)' }} disabled={isSubmitting}>
            {isSubmitting ? <Loader className="spin" size={18} /> : 'Complete Mock Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
