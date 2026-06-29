import React, { useState, useEffect } from 'react';
import { ShoppingBag, Loader, Search, ShoppingCart, Plus, X, ArrowLeft, Check } from 'lucide-react';
import { fetchProducts } from '../../services/api';
import { useCart } from '../../context/CartContext';
import './Shop.css';

export default function Shop() {
  const { getCartCount, setIsCartOpen, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'GBP': return '£';
      case 'USD': return '$';
      case 'NGN': return '₦';
      default: return '₦';
    }
  };

  return (
    <div className="shop-page page-transition">
      <header className="shop-hero">
        <div className="shop-hero-content animate-fade-in">
          <h1>The Sanctuary Shop</h1>
          <p>Exclusive merchandise, signed copies, and literary treasures.</p>
        </div>
      </header>

      <section className="shop-main container">
        <div className="shop-controls animate-slide-up">
          <div className="shop-search glass-card">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="shop-loading">
            <Loader className="spin" size={32} />
            <p>Curating the collection...</p>
          </div>
        ) : (
          <div className="shop-grid">
            {filteredProducts.length === 0 ? (
              <div className="shop-empty">
                <ShoppingBag size={48} />
                <p>No products found.</p>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <div 
                  onClick={() => setSelectedProduct(product)}
                  key={product._id} 
                  className="shop-card glass-card animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s`, cursor: 'pointer' }}
                >
                  <div className="shop-card-image-wrapper">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.title} loading="lazy" />
                    ) : (
                      <div className="shop-card-placeholder"><ShoppingBag size={48} opacity={0.5} /></div>
                    )}
                    {product.isFeatured && <span className="shop-badge featured">Featured</span>}
                    {product.stock === 0 && <span className="shop-badge sold-out">Sold Out</span>}
                  </div>
                  <div className="shop-card-content">
                    <span className="shop-card-category">{product.category}</span>
                    <h3>{product.title}</h3>
                    <div className="shop-card-footer">
                      <span className="shop-card-price">
                        {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
                      </span>
                      <button 
                        className="btn-quick-add"
                        disabled={product.stock <= 0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        title={product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      >
                        <Plus size={18} style={{ pointerEvents: 'none' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      <button className="floating-cart-btn glass-card" onClick={() => setIsCartOpen(true)}>
        <ShoppingCart size={24} />
        {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
      </button>

      {selectedProduct && (
        <div className="product-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="product-modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={20} />
            </button>
            
            <div className="product-gallery">
              <div className="product-breadcrumb">
                <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedProduct(null)}>
                  <ArrowLeft size={14} style={{ display: 'inline', marginRight: '4px' }} /> Shop
                </span>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>{selectedProduct.category}</span>
              </div>
              
              <div className="product-image-main">
                {selectedProduct.images && selectedProduct.images[0] ? (
                  <img src={selectedProduct.images[0]} alt={selectedProduct.title} />
                ) : (
                  <div className="shop-card-placeholder"><ShoppingCart size={64} opacity={0.3} /></div>
                )}
              </div>
            </div>

            <div className="product-info">
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedProduct.title}</h1>
              <div className="product-price" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                {getCurrencySymbol(selectedProduct.currency)}{selectedProduct.price.toFixed(2)}
              </div>
              
              <div className="product-description" style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {selectedProduct.description.split('\n').map((para, idx) => (
                  <p key={idx} style={{ marginBottom: '0.8rem' }}>{para}</p>
                ))}
              </div>

              <div className="product-actions" style={{ marginTop: 'auto' }}>
                <button 
                  className="product-modal-add-btn" 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={selectedProduct.stock <= 0}
                >
                  <ShoppingCart size={18} />
                  {selectedProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              <div className={`product-stock-status ${selectedProduct.stock > 0 ? 'status-in-stock' : 'status-out-stock'}`}>
                {selectedProduct.stock > 0 ? (
                  <><Check size={16} /> In Stock ({selectedProduct.stock} available)</>
                ) : (
                  'Currently out of stock.'
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
