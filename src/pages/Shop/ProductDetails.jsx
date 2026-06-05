import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Loader, Check } from 'lucide-react';
import { fetchProductById } from '../../services/api';
import './Shop.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await fetchProductById(id);
      setProduct(data);
    } catch (err) {
      setError('Product not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    // Pass product info to checkout route via state
    navigate('/shop/checkout', { state: { product } });
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'GBP': return '£';
      case 'USD': return '$';
      case 'NGN': return '₦';
      default: return '₦';
    }
  };

  if (loading) {
    return (
      <div className="shop-page page-transition">
        <div className="shop-loading">
          <Loader className="spin" size={32} />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="shop-page page-transition">
        <div className="shop-empty">
          <p>{error}</p>
          <Link to="/shop" className="btn btn-secondary">Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page page-transition">
      <div className="product-details-container animate-fade-in">
        <div className="product-gallery animate-slide-right">
          <div className="product-breadcrumb">
            <Link to="/shop"><ArrowLeft size={14} style={{ display: 'inline', marginRight: '4px' }} /> Shop</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span>{product.category}</span>
          </div>
          
          <div className="product-image-main">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt={product.title} />
            ) : (
              <div className="shop-card-placeholder"><ShoppingCart size={64} opacity={0.3} /></div>
            )}
          </div>
        </div>

        <div className="product-info animate-slide-left">
          <h1>{product.title}</h1>
          <div className="product-price">
            {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
          </div>
          
          <div className="product-description">
            {product.description.split('\n').map((para, idx) => (
              <p key={idx} style={{ marginBottom: '1rem' }}>{para}</p>
            ))}
          </div>

          <div className="product-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleCheckout}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={18} />
              {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
            </button>
          </div>

          <div className={`product-stock-status ${product.stock > 0 ? 'status-in-stock' : 'status-out-stock'}`}>
            {product.stock > 0 ? (
              <><Check size={16} /> In Stock ({product.stock} available)</>
            ) : (
              'Currently out of stock.'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
