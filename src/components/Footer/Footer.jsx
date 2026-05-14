import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer__glow" />
      <div className="container">
        {/* Main Footer */}
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <BookOpen size={20} strokeWidth={1.5} />
              <span><em>The</em> Reader's Index</span>
            </Link>
            <p className="footer__tagline">
              A curated literary sanctuary — from digital pages to a physical home for stories.
            </p>
            <h4 className="footer__connect-label">Connect With Us</h4>
            <div className="footer__socials">
              <a href="https://www.instagram.com/the_readers_index" target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="Instagram" id="footer-instagram" title="Follow us on Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://wa.me/2348109825703" target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="WhatsApp" id="footer-whatsapp" title="Chat on WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
              <a href="mailto:thereadersindex@gmail.com" className="footer__social" aria-label="Email" id="footer-email" title="Send us an email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="footer__nav-wrapper">
            <div className="footer__nav-group">
              <h4 className="footer__nav-title">Explore</h4>
              <Link to="/bookshelf" className="footer__nav-link">The Bookshelf</Link>
              <Link to="/recommendations" className="footer__nav-link">Recommendations</Link>
              <Link to="/coming-soon" className="footer__nav-link">Shop (Coming Soon)</Link>
              <Link to="/library-vision" className="footer__nav-link">The Library Vision</Link>
            </div>

            <div className="footer__nav-group">
              <h4 className="footer__nav-title">Community</h4>
              <Link to="/coming-soon" className="footer__nav-link">Book of the Month</Link>
              <Link to="/coming-soon" className="footer__nav-link">Reading Challenges</Link>
              <Link to="/coming-soon" className="footer__nav-link">Join Discord</Link>
              <Link to="/bookshelf" className="footer__nav-link">Submit a Review</Link>
            </div>
          </div>
        </div>

        <div className="footer__divider" />

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} The Readers Index.
          </p>
        </div>
      </div>
    </footer>
  );
}
