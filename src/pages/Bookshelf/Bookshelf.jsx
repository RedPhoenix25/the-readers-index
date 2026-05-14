import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal, X, LayoutGrid, List, LibraryBig, ChevronDown, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import BookCard from '../../components/BookCard/BookCard';
import BookModal from '../../components/BookModal/BookModal';
import { fetchBooks, fetchGenres, fetchMoods } from '../../services/api';
import './Bookshelf.css';

export default function Bookshelf() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeMood, setActiveMood] = useState('All');
  const [sortBy, setSortBy] = useState('highest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // API state
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState(['All']);
  const [moods, setMoods] = useState(['All']);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce timer for search
  const searchTimerRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search input
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [searchQuery]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeGenre, activeMood, sortBy]);

  // Fetch genres and moods on mount
  useEffect(() => {
    fetchGenres().then(setGenres).catch(() => {});
    fetchMoods().then(setMoods).catch(() => {});
  }, []);

  // Fetch books whenever filters or page change
  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBooks({
        genre: activeGenre,
        mood: activeMood,
        search: debouncedSearch,
        sort: sortBy,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setBooks(data.books);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load books. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeGenre, activeMood, debouncedSearch, sortBy, currentPage]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to the top of the results section smoothly
    const resultsSection = document.getElementById('bookshelf-controls');
    if (resultsSection) {
      const topPos = resultsSection.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setActiveGenre('All');
    setActiveMood('All');
    setSortBy('highest');
  };

  const hasActiveFilters = searchQuery || activeGenre !== 'All' || activeMood !== 'All';

  const sortLabels = {
    highest: 'Highest Rated',
    lowest: 'Lowest Rated',
    newest: 'Most Recent',
    oldest: 'Oldest First',
    title: 'A — Z',
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className="bookshelf-hero" id="bookshelf-hero">
        <div className="container">
          <span className="section-label">The Collection</span>
          <h1 className="section-title">The Bookshelf</h1>
          <p className="section-subtitle">
            Every book we've read, reviewed, and loved — searchable by genre, mood, and more.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bookshelf-controls" id="bookshelf-controls">
        <div className="container">
          <div className="bookshelf-controls__top">
            <div className="bookshelf-search">
              <Search size={18} className="bookshelf-search__icon" />
              <input
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bookshelf-search__input"
                id="bookshelf-search-input"
              />
              {searchQuery && (
                <button
                  className="bookshelf-search__clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="bookshelf-controls__right">
              <div className="bookshelf-sort-container" ref={sortRef}>
                <button 
                  className="bookshelf-sort-trigger" 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  id="bookshelf-sort-trigger"
                >
                  <span>{sortLabels[sortBy]}</span>
                  <ChevronDown size={14} className={isSortOpen ? 'rotate' : ''} />
                </button>
                
                {isSortOpen && (
                  <div className="bookshelf-sort-dropdown glass-card animate-fade-in">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <button
                        key={key}
                        className={`bookshelf-sort-option ${sortBy === key ? 'active' : ''}`}
                        onClick={() => { setSortBy(key); setIsSortOpen(false); }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bookshelf-view-toggle">
                <button
                  className={`btn btn-ghost ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  className={`btn btn-ghost ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List View"
                >
                  <List size={16} />
                </button>
              </div>

              <button
                className={`bookshelf-filter-toggle btn btn-secondary ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
                id="bookshelf-filter-toggle"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="bookshelf-active-filters animate-fade-in">
              <span className="bookshelf-active-filters__label">Active Filters:</span>
              
              {searchQuery && (
                <button className="bookshelf-filter-pill" onClick={() => setSearchQuery('')}>
                  "{searchQuery}" <X size={12} />
                </button>
              )}
              
              {activeGenre !== 'All' && (
                <button className="bookshelf-filter-pill" onClick={() => setActiveGenre('All')}>
                  {activeGenre} <X size={12} />
                </button>
              )}
              
              {activeMood !== 'All' && (
                <button className="bookshelf-filter-pill" onClick={() => setActiveMood('All')}>
                  {activeMood} <X size={12} />
                </button>
              )}

              <button className="bookshelf-filter-clear-all btn btn-ghost" onClick={clearFilters}>
                Clear All
              </button>
            </div>
          )}

          {/* Filter Panel */}
          <div className={`bookshelf-filters ${showFilters ? 'bookshelf-filters--open' : ''}`}>
            <div className="bookshelf-filters__group">
              <h4>Genre</h4>
              <div className="bookshelf-filters__tags">
                {genres.map((g) => (
                  <button
                    key={g}
                    className={`bookshelf-filters__tag ${activeGenre === g ? 'active' : ''}`}
                    onClick={() => setActiveGenre(g)}
                    id={`genre-filter-${g.toLowerCase()}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="bookshelf-filters__group">
              <h4>Mood</h4>
              <div className="bookshelf-filters__tags">
                {moods.slice(0, 12).map((m) => (
                  <button
                    key={m}
                    className={`bookshelf-filters__tag ${activeMood === m ? 'active' : ''}`}
                    onClick={() => setActiveMood(m)}
                    id={`mood-filter-${m.toLowerCase()}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {hasActiveFilters && (
              <button className="bookshelf-filters__clear btn btn-ghost" onClick={clearFilters}>
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section bookshelf-results" id="bookshelf-results">
        <div className="container">
          <p className="bookshelf-results__count">
            Showing <strong>{pagination.total}</strong> {pagination.total === 1 ? 'book' : 'books'}
            {hasActiveFilters && <span className="bookshelf-results__filtered"> (filtered)</span>}
          </p>

          {loading ? (
            <div className="bookshelf-loading animate-fade-in">
              <Loader size={32} className="bookshelf-loading__spinner" />
              <p>Loading the collection...</p>
            </div>
          ) : error ? (
            <div className="bookshelf-empty glass-card animate-fade-in-up">
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={loadBooks}>
                Try Again
              </button>
            </div>
          ) : books.length > 0 ? (
            <>
              <div className={`bookshelf-results-container ${viewMode === 'list' ? 'bookshelf-list' : 'bookshelf-grid'}`}>
                {books.map((book, i) => (
                  <BookCard key={book.id} book={book} index={i} onClick={setSelectedBook} viewMode={viewMode} />
                ))}
              </div>
              
              {pagination.totalPages > 1 && (
                <div className="bookshelf-pagination">
                  <button 
                    className="btn btn-ghost bookshelf-page-btn" 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: pagination.totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      className={`bookshelf-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(i + 1)}
                      aria-label={`Page ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    className="btn btn-ghost bookshelf-page-btn" 
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
                    disabled={currentPage === pagination.totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bookshelf-empty glass-card animate-fade-in-up">
              <div className="bookshelf-empty__icon-wrapper">
                <LibraryBig size={48} strokeWidth={1} className="bookshelf-empty__icon" />
              </div>
              <h3>No books found</h3>
              <p>We couldn't find any reads matching your current filters.</p>
              <button className="btn btn-primary" onClick={clearFilters} id="empty-clear-filters-btn">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
