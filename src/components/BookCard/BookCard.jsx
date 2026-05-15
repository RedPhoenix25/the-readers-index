import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, BookmarkPlus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../services/api';
import './BookCard.css';

export default function BookCard({ book, onClick, index = 0, viewMode = 'grid', isProfile = false }) {
  const [saving, setSaving] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const { user, userBooks, token, refreshUserBooks } = useAuth();
  const navigate = useNavigate();

  // Close actions when clicking elsewhere
  useEffect(() => {
    if (!showMobileActions) return;
    
    const handleClickOutside = () => setShowMobileActions(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showMobileActions]);

  const isAlreadySaved = userBooks.some(b => b.id === book.id);

  const handleCardClick = (e) => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      if (!showMobileActions) {
        // First tap: Show the buttons
        e.preventDefault();
        e.stopPropagation();
        setShowMobileActions(true);
        return;
      }
      // If we are here, actions are already showing. 
      // If they click the card (not the buttons), let it open the modal.
    }
    
    // On second click or desktop, open the modal
    onClick?.(book);
  };

  const handleReadReview = (e) => {
    e.stopPropagation();
    onClick?.(book);
  };

  const handleQuickSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/user/books`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ bookId: book.id, status: 'Want to Read' })
      });
      if (res.ok) {
        refreshUserBooks();
      }
    } catch (err) {
      console.error('Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(<Star key={i} size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />);
      } else if (i === full && hasHalf) {
        stars.push(<Star key={i} size={13} fill="var(--accent-gold)" color="var(--accent-gold)" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
      } else {
        stars.push(<Star key={i} size={13} color="var(--text-muted)" />);
      }
    }
    return stars;
  };

  return (
    <article
      className={`book-card glass-card animate-fade-in-up ${viewMode === 'list' ? 'book-card--list' : ''} ${showMobileActions ? 'book-card--active' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={handleCardClick}
      onMouseLeave={() => setShowMobileActions(false)}
      id={`book-card-${book.id}`}
    >
      <div className="book-card__cover-wrapper">
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="book-card__cover"
          loading="lazy"
        />
        <div className="book-card__cover-shine" />
        <div className="book-card__overlay">
          <div className="book-card__overlay-actions">
            <button 
              className="btn btn-primary book-card__action-btn book-card__action-btn--primary"
              onClick={handleReadReview}
            >
              Read Review
            </button>
            {!isProfile && (
              !isAlreadySaved ? (
                <button 
                  className={`btn btn-secondary book-card__action-btn ${saving ? 'loading' : ''}`}
                  onClick={handleQuickSave}
                  title="Add to Reading List"
                  disabled={saving}
                >
                  <BookmarkPlus size={14} style={{ marginRight: '6px' }} />
                  {saving ? 'Saving...' : 'Read Later'}
                </button>
              ) : (
                <div className="book-card__saved-badge">
                  <CheckCircle2 size={14} /> Saved
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div className="book-card__info">
        <div className="book-card__genre badge">{book.genre}</div>
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">by {book.author}</p>
        <div className="book-card__rating">
          <div className="star-rating">{renderStars(book.rating)}</div>
          <span className="book-card__rating-num">{book.rating}</span>
        </div>
      </div>
    </article>
  );
}
