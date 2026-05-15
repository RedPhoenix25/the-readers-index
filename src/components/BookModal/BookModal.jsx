import { useEffect, useState, useRef } from 'react';
import { X, Star, BookOpen, Quote, Calendar, FileText, Bookmark, CheckCircle2, Clock, Plus, Heart, MessageSquare, User, Send, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../services/api';
import './BookModal.css';

export default function BookModal({ book, onClose }) {
  const { user, userBooks, token, refreshUserBooks } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error'
  
  // Engagement State
  const [engagement, setEngagement] = useState({ likes: 0, userLiked: false, comments: [] });
  const [loadingEngagement, setLoadingEngagement] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const modalRef = useRef(null);
  const thoughtsContentRef = useRef(null);

  const currentStatus = userBooks.find(b => b.id === book.id)?.status;

  useEffect(() => {
    if (showComments) {
      if (modalRef.current) {
        modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (thoughtsContentRef.current) {
        thoughtsContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [showComments]);

  useEffect(() => {
    if (!book) return;
    
    const fetchEngagement = async () => {
      try {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch(`${API_BASE}/books/${book.id}/engagement`, { headers });
        if (res.ok) {
          const data = await res.json();
          setEngagement(data);
        }
      } catch (err) {
        console.error('Failed to fetch engagement data');
      } finally {
        setLoadingEngagement(false);
      }
    };

    fetchEngagement();
  }, [book, token]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!book) return null;

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={18}
          fill={i < full ? 'var(--accent-gold)' : 'transparent'}
          color={i < full ? 'var(--accent-gold)' : 'var(--text-muted)'}
        />
      );
    }
    return stars;
  };

  const renderInteractiveStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className="star-btn"
          onClick={() => setNewRating(i)}
          disabled={!user || submittingComment}
          title={`${i} Star${i > 1 ? 's' : ''}`}
        >
          <Star
            size={20}
            fill={i <= newRating ? 'var(--accent-gold)' : 'transparent'}
            color={i <= newRating ? 'var(--accent-gold)' : 'var(--border-light)'}
            style={{ transition: 'all 0.2s' }}
          />
        </button>
      );
    }
    return stars;
  };

  const handleAddToShelf = async (status) => {
    if (!token) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`${API_BASE}/user/books`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ bookId: book.id, status })
      });
      if (res.ok) {
        setSaveStatus('success');
        refreshUserBooks();
        setTimeout(() => setSaveStatus(null), 2000);
      }
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleLike = async () => {
    if (!user) return alert("Please sign in to like this book.");
    
    // Optimistic update
    const isLiking = !engagement.userLiked;
    setEngagement(prev => ({
      ...prev,
      userLiked: isLiking,
      likes: prev.likes + (isLiking ? 1 : -1)
    }));

    try {
      await fetch(`${API_BASE}/books/${book.id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      // Revert on error
      setEngagement(prev => ({
        ...prev,
        userLiked: !isLiking,
        likes: prev.likes + (!isLiking ? 1 : -1)
      }));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please sign in to comment.");
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`${API_BASE}/books/${book.id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ content: newComment, rating: newRating > 0 ? newRating : null })
      });
      if (res.ok) {
        const comment = await res.json();
        setEngagement(prev => ({
          ...prev,
          comments: [comment, ...prev.comments]
        }));
        setNewComment('');
        setNewRating(0);
      }
    } catch (err) {
      alert("Failed to post comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setEngagement(prev => ({
          ...prev,
          comments: prev.comments.filter(c => c.id !== commentId)
        }));
      }
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} id="book-modal-backdrop">
      <div 
        className="modal animate-scale-in" 
        onClick={(e) => e.stopPropagation()} 
        id="book-modal"
        ref={modalRef}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close modal" id="modal-close-btn">
          <X size={20} />
        </button>

        <div className="modal__content">
          <div className="modal__cover-side">
            <div className="modal__cover-wrapper">
              <img src={book.cover} alt={book.title} className="modal__cover" />
              <div className="modal__cover-glow" />
            </div>
            <div className="modal__meta">
              <div className="modal__meta-item">
                <Calendar size={14} />
                <span>{book.year}</span>
              </div>
              <div className="modal__meta-item">
                <FileText size={14} />
                <span>{book.pages} pages</span>
              </div>
            </div>
          </div>

          <div className="modal__details">
            <div className="badge">{book.genre}</div>
            <h2 className="modal__title">{book.title}</h2>
            <p className="modal__author">by {book.author}</p>

            <div className="modal__rating">
              <div className="star-rating">{renderStars(book.rating)}</div>
              <span className="modal__rating-text">{book.rating} / 5</span>
            </div>

            <div className="modal__moods">
              {book.mood.map((m) => (
                <span key={m} className="modal__mood-tag">{m}</span>
              ))}
            </div>

            {book.quote && (
              <blockquote className="modal__quote">
                <Quote size={18} className="modal__quote-icon" />
                <p>{book.quote}</p>
              </blockquote>
            )}

            <div className="modal__review">
              <h4><BookOpen size={16} /> Our Review</h4>
              <p>{book.review}</p>
            </div>

            <div className="modal__engagement">
              <div className="engagement-actions">
                <button 
                  className={`engagement-btn ${engagement.userLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                  title={engagement.userLiked ? "Unlike" : "Like"}
                >
                  <Heart size={20} fill={engagement.userLiked ? "var(--accent-gold)" : "none"} color={engagement.userLiked ? "var(--accent-gold)" : "currentColor"} />
                  <span>{engagement.likes || 0}</span>
                </button>
                <button 
                  className="engagement-btn conversation-btn"
                  onClick={() => setShowComments(true)}
                >
                  <MessageSquare size={20} />
                  <span>{engagement.comments.length || 0} Thoughts</span>
                </button>
              </div>

              <div className="conversation-hub-preview glass-card" onClick={() => setShowComments(true)}>
                <div className="hub-info">
                  <h4>Conversation Hub</h4>
                  <p>{engagement.comments.length > 0 ? `Join ${engagement.comments.length} others sharing their thoughts...` : "Be the first to share your thoughts on this book."}</p>
                </div>
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* FOCUSED THOUGHTS OVERLAY */}
        {showComments && (
          <div className="thoughts-overlay animate-fade-in">
            <div className="thoughts-container animate-slide-up">
              <header className="thoughts-header">
                <button className="back-btn" onClick={() => setShowComments(false)}>
                  <ArrowLeft size={20} /> Back to Review
                </button>
                <h3>Community Thoughts</h3>
                <div className="thoughts-count-badge">{engagement.comments.length}</div>
              </header>

              <div className="thoughts-content" ref={thoughtsContentRef}>
                <div className="thoughts-input-section">
                  <div className="thoughts-input-header">
                    <h4>Share your thoughts</h4>
                    {user && (
                      <div className="comment-rating-selector">
                        <span className="rating-label">Your Rating:</span>
                        <div className="interactive-stars">{renderInteractiveStars()}</div>
                      </div>
                    )}
                  </div>
                  <form className="thoughts-form" onSubmit={handleCommentSubmit}>
                    <textarea 
                      placeholder={user ? "What did you think of this book? Share your impressions..." : "Sign in to join the discussion"}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={!user || submittingComment}
                      rows={4}
                    />
                    <div className="thoughts-form-footer">
                      <p className="form-note">Keep it respectful and focused on the story.</p>
                      <button type="submit" disabled={!user || !newComment.trim() || submittingComment} className="btn btn-primary">
                        {submittingComment ? "Posting..." : "Post Thought"} <Send size={16} />
                      </button>
                    </div>
                  </form>
                </div>

                <div className="thoughts-list-section">
                  <h4>All User Thoughts</h4>
                  <div className="thoughts-list">
                    {loadingEngagement ? (
                      <div className="comments-loading">Loading thoughts...</div>
                    ) : engagement.comments.length === 0 ? (
                      <div className="comments-empty">
                        <div className="empty-icon"><MessageSquare size={40} opacity={0.2} /></div>
                        <p>The conversation hasn't started yet.</p>
                      </div>
                    ) : (
                      engagement.comments.map(comment => (
                        <div key={comment.id} className="comment-item animate-fade-in">
                          <div className="comment-avatar">
                            {comment.avatar ? (
                              <img src={comment.avatar} alt={comment.username} />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-author">{comment.username}</span>
                              {comment.rating && (
                                <div className="comment-stars">
                                  {[...Array(comment.rating)].map((_, i) => (
                                    <Star key={i} size={12} fill="var(--accent-gold)" color="var(--accent-gold)" />
                                  ))}
                                </div>
                              )}
                              <span className="comment-date">
                                {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {(user && (user.id === comment.user_id || user.isAdmin)) && (
                                <button 
                                  className="btn-comment-delete"
                                  onClick={() => handleDeleteComment(comment.id)}
                                  title="Delete comment"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
