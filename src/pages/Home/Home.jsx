import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronRight, Sparkles, Mail, Star, Users, Library } from 'lucide-react';
import BookCard from '../../components/BookCard/BookCard';
import BookModal from '../../components/BookModal/BookModal';
import { fetchBooks, fetchCurrentlyReading, subscribe } from '../../services/api';
import './Home.css';

const heroQuotes = [
  "Between life and death there is a library...",
  "A reader lives a thousand lives before he dies...",
  "Books are a uniquely portable magic...",
  "There is no friend as loyal as a book...",
];

export default function Home() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  
  // API Data State
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [readingStatus, setReadingStatus] = useState(null);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featuredData, recentData, currentReading] = await Promise.all([
          fetchBooks({ featured: true, limit: 4 }),
          fetchBooks({ sort: 'newest', limit: 8 }),
          fetchCurrentlyReading()
        ]);

        setFeaturedBooks(featuredData?.books || []);
        setRecentlyAdded(recentData?.books || []);
        setTotalBooks(recentData?.pagination?.total || 0);
        setReadingStatus(currentReading);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();

    const interval = setInterval(() => {
      setIsQuoteVisible(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % heroQuotes.length);
        setIsQuoteVisible(true);
      }, 3000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    try {
      await subscribe(email);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      alert(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* ===== HERO ===== */}
      <section className="hero" id="hero-section">
        {/* Floating dust particles */}
        <div className="hero__particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="hero__particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 10}s`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
              }}
            />
          ))}
        </div>

        <div className="hero__content container">
          <div className="hero__badge animate-fade-in-up">
            <Sparkles size={14} />
            <span>A Curated Literary Sanctuary</span>
          </div>

          <h1 className="hero__title animate-fade-in-up delay-1">
            <span className="hero__title-the">The</span><br />
            <span className="hero__title-main">Readers Index</span>
          </h1>

          <p className={`hero__quote ${isQuoteVisible ? 'animate-fade-in' : 'animate-fade-out'}`}>
            "{heroQuotes[quoteIndex]}"
          </p>

          <p className="hero__subtitle animate-fade-in-up delay-3">
            Discover your next favorite book through curated reviews, personalized recommendations,
            and a community of passionate readers building toward something extraordinary.
          </p>

          <div className="hero__actions animate-fade-in-up delay-4">
            <Link to="/bookshelf" className="btn btn-primary" id="hero-explore-btn">
              Explore the Bookshelf <ArrowRight size={16} />
            </Link>
            <Link to="/recommendations" className="btn btn-secondary" id="hero-quiz-btn">
              Find Your Next Read
            </Link>
          </div>

          <div className="hero__stats animate-fade-in-up delay-5">
            <div className="hero__stat">
              <span className="hero__stat-num">{totalBooks}+</span>
              <span className="hero__stat-label">Reviews</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">2.4k</span>
              <span className="hero__stat-label">Readers</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">7</span>
              <span className="hero__stat-label">Genres</span>
            </div>
          </div>
        </div>

        <div className="hero__scroll-indicator">
          <span>Scroll to discover</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ===== CURRENTLY READING ===== */}
      <section className="section currently-reading" id="currently-reading">
        <div className="container">
          <span className="section-label">What I'm Reading Now</span>
          {readingStatus ? (
            <div className="currently-reading__card glass-card">
              <div className="currently-reading__cover-wrapper">
                <img
                  src={readingStatus.cover}
                  alt={readingStatus.title}
                  className="currently-reading__cover"
                />
              </div>
              <div className="currently-reading__info">
                <h3>{readingStatus.title}</h3>
                <p className="currently-reading__author">by {readingStatus.author}</p>
                <div className="currently-reading__progress">
                  <div className="currently-reading__progress-bar">
                    <div
                      className="currently-reading__progress-fill"
                      style={{ width: `${readingStatus.progress}%` }}
                    />
                  </div>
                  <span className="currently-reading__progress-text">
                    {readingStatus.progress}% complete
                  </span>
                </div>
                <p className="currently-reading__thoughts">
                  <em>"{readingStatus.thoughts}"</em>
                </p>
              </div>
            </div>
          ) : (
            <div className="currently-reading__empty glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Nothing on the bedside table right now. Browsing for the next story...</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURED REVIEWS ===== */}
      <section className="section featured-reviews" id="featured-reviews">
        <div className="container">
          <div className="featured-reviews__header">
            <div>
              <span className="section-label">Featured Reviews</span>
              <h2 className="section-title">Staff Picks & Favorites</h2>
            </div>
            <Link to="/bookshelf" className="btn btn-secondary" id="view-all-reviews-btn">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="featured-reviews__grid">
            {featuredBooks.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} onClick={setSelectedBook} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENTLY ADDED CAROUSEL ===== */}
      <section className="section recently-added" id="recently-added">
        <div className="container">
          <div className="featured-reviews__header">
            <div>
              <span className="section-label">Fresh on the Shelf</span>
              <h2 className="section-title">Recently Added</h2>
            </div>
          </div>
          <div className="recently-added__carousel">
            {recentlyAdded.map((book, i) => (
              <div className="recently-added__card-wrapper" key={book.id}>
                <BookCard book={book} index={i} onClick={setSelectedBook} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="section mission" id="mission-section">
        <div className="container">
          <div className="mission__card">
            <div className="mission__icon-group">
              <Library size={40} strokeWidth={1} />
            </div>
            <h2>More Than a Website.<br /><span className="text-gradient">A Movement.</span></h2>
            <p>
              The Readers Index isn't just a collection of reviews — it's the first chapter
              in a bigger story. We're building a community of readers united by a shared dream:
              to open a real, physical library where stories come alive and everyone is welcome.
            </p>
            <div className="mission__links">
              <Link to="/library-vision" className="btn btn-primary" id="mission-vision-btn">
                Read Our Vision <ArrowRight size={16} />
              </Link>
              <Link to="/coming-soon" className="btn btn-secondary" id="mission-shop-btn">
                Support the Journey <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="section newsletter-section" id="newsletter-section">
        <div className="container">
          <div className="newsletter__card glass-card">
            <div className="newsletter__content">
              <span className="section-label">Join the Community</span>
              <h2>Never Miss a Recommendation</h2>
              <p>
                Get our weekly curated list, exclusive reviews, and be the first
                to know about new features, events, and our library journey.
              </p>
              {subscribed ? (
                <div className="newsletter__success animate-fade-in">
                  <Sparkles size={18} className="newsletter__success-icon" />
                  <h4>Welcome to the community!</h4>
                  <p>Check your inbox to confirm your subscription.</p>
                </div>
              ) : (
                <form className="newsletter__form" onSubmit={handleSubscribe}>
                  <div className="newsletter__input-group">
                    <Mail size={18} className="newsletter__icon" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="newsletter__input"
                      id="home-newsletter-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubscribing}
                    />
                    <button type="submit" className="btn btn-primary" id="home-newsletter-btn" disabled={isSubscribing}>
                      {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                  <p className="newsletter__privacy">
                    No spam, ever. Unsubscribe anytime. We respect your inbox.
                  </p>
                </form>
              )}
            </div>
            <div className="newsletter__visual">
              <div className="newsletter__books-stack">
                <BookOpen size={80} strokeWidth={0.5} className="newsletter__big-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Modal */}
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
