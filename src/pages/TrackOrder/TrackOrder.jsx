import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { trackOrder } from '../../services/api';
import toast from 'react-hot-toast';
import { Package, Search, MapPin, Truck, CheckCircle2, Clock } from 'lucide-react';
import './TrackOrder.css';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId || !email) {
      toast.error('Please provide both Order ID and Email.');
      return;
    }

    setLoading(true);
    try {
      const data = await trackOrder(orderId, email);
      setOrderData(data);
      toast.success('Order found!');
    } catch (err) {
      setOrderData(null);
      toast.error(err.message || 'Could not find order. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return 0;
      default: return 1;
    }
  };

  return (
    <div className="track-order-page page-wrapper">
      <div className="container">
        <div className="track-order-header animate-fade-in-up">
          <h1>Track Your Order</h1>
          <p>Enter your order details below to see the current status of your shipment.</p>
        </div>

        <div className="track-order-content">
          <div className="track-order-form-card glass-card animate-scale-in">
            <form onSubmit={handleTrackOrder}>
              <div className="form-group">
                <label>Order ID</label>
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. 64b7f..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email used during checkout"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Searching...' : <><Search size={18} /> Track Order</>}
              </button>
            </form>
          </div>

          {orderData && (
            <div className="track-order-result glass-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="order-result-header">
                <h2>Order <span style={{ fontFamily: 'monospace', color: 'var(--accent-gold)' }}>#{orderData._id.substring(0, 8)}</span></h2>
                <span className={`badge status-badge status-${orderData.status.toLowerCase()}`}>{orderData.status}</span>
              </div>

              {orderData.status !== 'Cancelled' && (
                <div className="order-timeline">
                  <div className={`timeline-step ${getStatusStep(orderData.status) >= 1 ? 'active' : ''}`}>
                    <div className="step-icon"><Clock size={20} /></div>
                    <p>Order Placed</p>
                  </div>
                  <div className={`timeline-line ${getStatusStep(orderData.status) >= 2 ? 'active' : ''}`} />
                  <div className={`timeline-step ${getStatusStep(orderData.status) >= 2 ? 'active' : ''}`}>
                    <div className="step-icon"><Package size={20} /></div>
                    <p>Processing</p>
                  </div>
                  <div className={`timeline-line ${getStatusStep(orderData.status) >= 3 ? 'active' : ''}`} />
                  <div className={`timeline-step ${getStatusStep(orderData.status) >= 3 ? 'active' : ''}`}>
                    <div className="step-icon"><Truck size={20} /></div>
                    <p>Shipped</p>
                  </div>
                  <div className={`timeline-line ${getStatusStep(orderData.status) >= 4 ? 'active' : ''}`} />
                  <div className={`timeline-step ${getStatusStep(orderData.status) >= 4 ? 'active' : ''}`}>
                    <div className="step-icon"><CheckCircle2 size={20} /></div>
                    <p>Delivered</p>
                  </div>
                </div>
              )}

              <div className="order-info-grid">
                <div className="info-box">
                  <h3>Shipping Details</h3>
                  <p><strong>{orderData.shippingAddress.fullName}</strong></p>
                  <p>{orderData.shippingAddress.street}</p>
                  <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}</p>
                  <p>{orderData.shippingAddress.country}</p>
                </div>
                
                {(orderData.trackingNumber || orderData.trackingUrl) && (
                  <div className="info-box tracking-box">
                    <h3>Carrier Information</h3>
                    {orderData.trackingNumber && (
                      <p><strong>Tracking Number:</strong> {orderData.trackingNumber}</p>
                    )}
                    {orderData.trackingUrl && (
                      <a href={orderData.trackingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                        <MapPin size={16} /> Track on Carrier Site
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="order-items">
                <h3>Items in your order</h3>
                <div className="items-list">
                  {orderData.products.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <div className="item-name">
                        <span className="qty">{item.quantity}x</span> {item.product?.title || 'Unknown Product'}
                      </div>
                      <div className="item-price">₦{(item.priceAtPurchase * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                  <div className="order-total-row">
                    <span>Total</span>
                    <span>₦{orderData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '2rem', textAlign: 'center', width: '100%', maxWidth: '500px' }}>
            <Link to="/shop" className="btn btn-secondary" style={{ width: '100%' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
