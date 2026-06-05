import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Check, ArrowLeft, Loader } from 'lucide-react';
import { createOrder } from '../../services/api';
import './Shop.css';
import toast from 'react-hot-toast';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!product) {
    return (
      <div className="shop-page page-transition">
        <div className="shop-empty">
          <p>No item selected for checkout.</p>
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
      products: [{ product: product._id, quantity: 1, priceAtTime: product.price }],
      totalAmount: product.price,
      shippingAddress: {
        fullName: formData.name,
        addressLine1: formData.addressLine1,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }
    };

    try {
      await createOrder(orderData);
      setOrderSuccess(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
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
        <div className="checkout-success glass-card animate-scale-in">
          <div className="checkout-success-icon">
            <Check size={40} />
          </div>
          <h2>Order Confirmed</h2>
          <p>Your mock order has been placed successfully and is now pending in the Admin Dashboard.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page page-transition">
      <div className="checkout-header animate-fade-in">
        <Link to={`/shop/${product._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Product
        </Link>
        <h1>Mock Checkout</h1>
        <p>This is a simulated checkout. No payment is required.</p>
      </div>

      <div className="checkout-form-card glass-card animate-slide-up">
        <div className="checkout-summary">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} />
          ) : (
            <div style={{ width: '60px', height: '60px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }} />
          )}
          <div className="checkout-summary-details">
            <h4>{product.title}</h4>
            <p>{getCurrencySymbol(product.currency)}{product.price.toFixed(2)}</p>
          </div>
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
            <label>Address Line 1</label>
            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>State / Province</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
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
              {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
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
