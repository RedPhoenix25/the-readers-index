import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { Bell, ShoppingBag, Mail, Clock, Package, ArrowRight, Sparkles } from 'lucide-react';
import { shopProducts } from '../../data/books';
import { subscribe } from '../../services/api';
import './ComingSoon.css';

// Removing numeric CountdownUnit as it is no longer needed

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState(0);
  const phases = [
    "Curating inventory...",
    "Designing merchandise...",
    "Brewing coffee...",
    "Preparing the shelves..."
  ];

  const renderIcon = (iconName, size = 20) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={size} strokeWidth={1.5} /> : null;
  };

  // Cycle through phases every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % phases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phases.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await subscribe(email, 'Waitlist');
        setSubmitted(true);
        setEmail('');
      } catch (err) {
        alert(err.message || 'Failed to join waitlist');
      }
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className="shop-hero" id="shop-hero">
        <div className="container">
          <span className="section-label">
            <Clock size={14} /> Coming Soon
          </span>
          <h1 className="section-title">
            The Bookish <span className="text-gradient">Shop</span>
          </h1>
          <p className="section-subtitle">
            Curated reads, bookish merchandise, and monthly book boxes — all handpicked with love.
            Sign up to be the first to know when we launch.
          </p>
        </div>
      </section>

      {/* Indefinite Status */}
      <section className="section shop-countdown" id="shop-countdown">
        <div className="container">
          <div className="countdown glass-card">
            <h3>Shop Status</h3>
            <div className="status-indicator">
              <div className="status-indicator__visual">
                <div className="status-indicator__core"></div>
                <div className="status-indicator__ring"></div>
                <div className="status-indicator__ring-2"></div>
              </div>
              <div className="status-indicator__text" key={phase}>
                {phases[phase]}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Teasers */}
      <section className="section shop-products" id="shop-products">
        <div className="container">
          <div className="text-center">
            <span className="section-label">Sneak Peek</span>
            <h2 className="section-title">What's Coming</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              A taste of what we're preparing for you.
            </p>
          </div>

          <div className="shop-products__grid">
            {shopProducts.map((product, i) => (
              <article
                key={product.id}
                className="product-card glass-card animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
                id={`product-card-${product.id}`}
              >
                <div className="product-card__icon-wrapper">
                  {renderIcon(product.icon, 28)}
                </div>
                <div className="product-card__badge badge">{product.category}</div>
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__desc">{product.description}</p>
                <button className="product-card__notify btn btn-secondary" id={`notify-btn-${product.id}`}
                  onClick={() => {
                    document.getElementById('shop-waitlist')?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                      document.getElementById('waitlist-email-input')?.focus();
                    }, 600);
                  }}
                >
                  <Bell size={14} /> Notify Me
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="section shop-waitlist" id="shop-waitlist">
        <div className="container">
          <div className="waitlist-card glass-card">
            <div className="waitlist-card__icon">
              <ShoppingBag size={48} strokeWidth={1} />
            </div>
            <h2>Join the Waitlist</h2>
            <p>
              Be the first to shop when we launch. Early supporters get exclusive
              discounts and first access to limited-edition items.
            </p>

            {!submitted ? (
              <form className="waitlist-card__form" onSubmit={handleSubmit}>
                <div className="waitlist-card__input-group">
                  <Mail size={18} className="waitlist-card__input-icon" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="waitlist-card__input"
                    required
                    id="waitlist-email-input"
                  />
                  <button type="submit" className="btn btn-primary" id="waitlist-submit-btn">
                    Join Waitlist <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="waitlist-card__success animate-scale-in">
                <div className="waitlist-card__success-icon">
                  <Sparkles size={28} />
                </div>
                <h3>You're on the list!</h3>
                <p>We'll let you know as soon as the shop doors open.</p>
              </div>
            )}

            <div className="waitlist-card__perks">
              <div className="waitlist-card__perk">
                <Package size={16} />
                <span>Early Access</span>
              </div>
              <div className="waitlist-card__perk">
                <ShoppingBag size={16} />
                <span>Exclusive Discounts</span>
              </div>
              <div className="waitlist-card__perk">
                <Bell size={16} />
                <span>Launch Day Alert</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
