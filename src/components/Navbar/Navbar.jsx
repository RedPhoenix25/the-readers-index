import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/bookshelf', label: 'The Bookshelf' },
  { path: '/recommendations', label: 'Recommendations' },
  { path: '/coming-soon', label: 'Shop' },
  { path: '/library-vision', label: 'The Vision' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  return (
    <nav className={`navbar ${scrolled && !isOpen ? 'navbar--scrolled' : ''} ${isOpen ? 'navbar--solid' : ''}`} id="main-navigation">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" id="nav-logo">
          <BookOpen size={24} strokeWidth={1.5} />
          <span className="navbar__logo-text">
            <span className="navbar__logo-the">The</span> Reader's Index
          </span>
        </Link>

        <div className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
              id={`nav-link-${link.path.replace('/', '') || 'home'}`}
            >
              {link.label}
              {location.pathname === link.path && <span className="navbar__link-dot" />}
            </Link>
          ))}
          
          {user ? (
            <div className="navbar__user">
              <Link to="/my-shelf" className="navbar__link navbar__link--user">
                <User size={16} /> My Archive
              </Link>
              <button onClick={logout} className="navbar__link navbar__logout-btn">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar__link navbar__login-link">
              Sign In
            </Link>
          )}
        </div>

        <button
          className="navbar__toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          id="nav-toggle"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
}
