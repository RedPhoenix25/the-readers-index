import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader, Search, ShoppingCart, Plus } from 'lucide-react';
import { fetchProducts } from '../../services/api';
import { useCart } from '../../context/CartContext';
import './Shop.css';

export default function Shop() {
  const { getCartCount, setIsCartOpen, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
                <Link 
                  to={`/shop/${product._id}`} 
                  key={product._id} 
                  className="shop-card glass-card animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
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
                          addToCart(product);
                        }}
                        title={product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </section>

      <button className="floating-cart-btn glass-card" onClick={() => setIsCartOpen(true)}>
        <ShoppingCart size={24} />
        {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
      </button>
    </div>
  );
}
