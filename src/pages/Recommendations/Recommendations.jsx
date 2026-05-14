import { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, ArrowLeft, Sparkles, RotateCcw, BookOpen, Share2, BookmarkPlus, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import BookCard from '../../components/BookCard/BookCard';
import BookModal from '../../components/BookModal/BookModal';
import { fetchBooks, fetchLists } from '../../services/api';
import { quizQuestions } from '../../data/books';
import './Recommendations.css';

export default function Recommendations() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeList, setActiveList] = useState(null);
  
  // Share state
  const resultsRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // API Data State
  const [allBooks, setAllBooks] = useState([]);
  const [curatedLists, setCuratedLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksData, listsData] = await Promise.all([
          fetchBooks({ limit: 100 }),
          fetchLists()
        ]);
        setAllBooks(booksData.books);
        setCuratedLists(listsData);
      } catch (err) {
        console.error('Failed to load data for recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const getRecommendations = () => {
    const moodCounts = {};
    let preferredGenre = null;
    let preferredLength = null;

    answers.forEach((ans) => {
      if (ans.mood) moodCounts[ans.mood] = (moodCounts[ans.mood] || 0) + 1;
      if (ans.genre) preferredGenre = ans.genre;
      if (ans.length) preferredLength = ans.length;
    });

    const scoredBooks = allBooks
      .map((book) => {
        let score = 0;

        // 1. Mood Matching (Weighted)
        book.mood.forEach((m) => {
          if (moodCounts[m]) score += moodCounts[m] * 2; // Mood is core
        });

        // 2. Genre Priority (+5 points)
        if (preferredGenre && book.genre === preferredGenre) {
          score += 5;
        }

        // 3. Page Count Logic
        if (preferredLength) {
          if (preferredLength === 'Short' && book.pages < 300) score += 3;
          if (preferredLength === 'Short' && book.pages > 500) score -= 5;
          if (preferredLength === 'Medium' && book.pages >= 300 && book.pages <= 450) score += 3;
          if (preferredLength === 'Long' && book.pages > 450) score += 3;
          if (preferredLength === 'Long' && book.pages < 250) score -= 5;
        }

        return { ...book, score };
      })
      .filter((b) => b.score > 0)
      .sort((a, b) => b.score - a.score || b.rating - a.rating);

    if (scoredBooks.length <= 4) return scoredBooks;

    // 4. Discovery Mode
    // Keep top 3 perfect matches
    const top3 = scoredBooks.slice(0, 3);
    // For the 4th slot, pick a highly rated book (>= 4.2) that didn't make top 3 
    // but is still relevant (has at least some score)
    const others = scoredBooks.slice(3);
    const discoveryBook = others.find(b => b.rating >= 4.2) || others[0];

    return [...top3, discoveryBook];
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handleShareLink = async () => {
    const shareData = {
      title: 'My Perfect Reads from The Readers Index',
      text: 'I just took The Book Taste Quiz on The Readers Index and found my perfect next reads! Take the quiz to find yours. 📖✨',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDownloadImage = async () => {
    if (!resultsRef.current) return;
    try {
      setIsGenerating(true);
      
      // Wait for state updates and images to settle
      await new Promise(resolve => setTimeout(resolve, 150));

      const options = {
        quality: 1,
        pixelRatio: 3, // High quality for mobile screens
        skipFonts: false,
      };

      const dataUrl = await toPng(resultsRef.current, options);
      const link = document.createElement('a');
      link.download = 'my-readers-index-picks.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Failed to generate your share card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderIcon = (iconName, size = 20) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={size} strokeWidth={1.5} /> : null;
  };

  const getListBooks = (listId) => {
    const list = curatedLists.find(l => l.id === listId);
    if (!list || !list.bookIds || list.bookIds.length === 0) {
      // Fallback to automatic if no manual selection exists (optional)
      return allBooks.slice(0, 4);
    }
    return allBooks.filter(book => list.bookIds.includes(book.id));
  };

  const progress = quizStarted ? ((currentQuestion + (showResults ? 1 : 0)) / quizQuestions.length) * 100 : 0;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className="reco-hero" id="reco-hero">
        <div className="container">
          <span className="section-label">Personalized for You</span>
          <h1 className="section-title">Find Your Next Read</h1>
          <p className="section-subtitle">
            Take our taste quiz or browse curated lists to discover your perfect book match.
          </p>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="section reco-quiz" id="reco-quiz">
        <div className="container">
          <div className="reco-quiz__card glass-card">
            {!quizStarted && !showResults && (
              <div className="reco-quiz__start animate-fade-in">
                <div className="reco-quiz__start-icon">
                  <Sparkles size={48} strokeWidth={1} />
                </div>
                <h2>The Book Taste Quiz</h2>
                <p>
                  Answer 6 quick questions about your reading mood and we'll recommend
                  your perfect next read from our collection.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setQuizStarted(true)}
                  id="start-quiz-btn"
                >
                  Start the Quiz <ArrowRight size={16} />
                </button>
              </div>
            )}

            {quizStarted && !showResults && (
              <div className="reco-quiz__question animate-fade-in" key={currentQuestion}>
                <div className="reco-quiz__progress">
                  <div className="reco-quiz__progress-bar">
                    <div
                      className="reco-quiz__progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="reco-quiz__progress-text">
                    {currentQuestion + 1} / {quizQuestions.length}
                  </span>
                </div>

                <h2 className="reco-quiz__question-text">
                  {quizQuestions[currentQuestion].question}
                </h2>

                <div className="reco-quiz__options">
                  {quizQuestions[currentQuestion].options.map((option, i) => (
                    <button
                      key={i}
                      className="reco-quiz__option glass-card"
                      onClick={() => handleAnswer(option)}
                      id={`quiz-option-${currentQuestion}-${i}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <span className="reco-quiz__option-icon">{renderIcon(option.icon, 24)}</span>
                      <span className="reco-quiz__option-text">{option.text}</span>
                      <ArrowRight size={16} className="reco-quiz__option-arrow" />
                    </button>
                  ))}
                </div>

                {currentQuestion > 0 && (
                  <button
                    className="btn btn-ghost reco-quiz__back"
                    onClick={() => {
                      setCurrentQuestion((prev) => prev - 1);
                      setAnswers((prev) => prev.slice(0, -1));
                    }}
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
              </div>
            )}

            {showResults && (
              <div className="reco-quiz__results animate-fade-in">
                {/* Visible Results Area */}
                <div className="reco-quiz__capture-area">
                  <div className="reco-quiz__results-header">
                    <Sparkles size={24} className="reco-quiz__results-icon" />
                    <h2>Your Perfect Reads</h2>
                    <p>Based on your answers, here's what we think you'll love:</p>
                  </div>

                  <div className="reco-quiz__results-grid">
                    {getRecommendations().map((book, i) => (
                      <div key={book.id} className="reco-result-item">
                        {i === 3 && <div className="discovery-label"><Sparkles size={12} /> Discovery Pick</div>}
                        <BookCard book={book} index={i} onClick={setSelectedBook} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hidden Share Card for Image Generation (9:16 Aspect Ratio) */}
                <div 
                  style={{ position: 'absolute', top: 0, left: '-9999px', opacity: 0, pointerEvents: 'none', zIndex: -10 }}
                >
                  <div 
                    ref={resultsRef} 
                    style={{
                      width: '450px',
                      height: '800px',
                      background: 'var(--bg-primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2rem 1rem',
                      boxSizing: 'border-box',
                      fontFamily: 'Inter, sans-serif',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <BookOpen size={32} color="#C9A84C" style={{ margin: '0 auto 0.5rem' }} />
                      <h2 style={{ color: '#F5F0E8', fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', margin: '0 0 0.25rem' }}>My Perfect Reads</h2>
                      <p style={{ color: '#A89F91', fontSize: '0.9rem', margin: 0 }}>Curated by The Readers Index</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '340px', margin: '0 auto' }}>
                      {getRecommendations().slice(0, 4).map((book, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ position: 'relative', width: '125px', height: '185px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
                            <img 
                              src={book.cover} 
                              alt={book.title} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                          <h3 style={{ color: '#F5F0E8', fontSize: '0.8rem', margin: '0.5rem 0 0', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                            {book.title}
                          </h3>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(201,168,76,0.3)', paddingTop: '1rem', width: '80%', textAlign: 'center' }}>
                      <p style={{ color: '#C9A84C', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', margin: 0 }}>READERSINDEX.COM</p>
                    </div>
                  </div>
                </div>

                <div className="reco-quiz__results-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary" onClick={resetQuiz} id="retake-quiz-btn">
                    <RotateCcw size={14} /> Retake Quiz
                  </button>
                  <button className="btn btn-primary" onClick={handleShareLink} id="share-results-btn">
                    <Share2 size={14} /> Share Link
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleDownloadImage} 
                    id="download-results-btn"
                    disabled={isGenerating}
                  >
                    <Download size={14} /> {isGenerating ? 'Creating...' : 'Save as Image'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Curated Lists */}
      <section className="section reco-lists" id="reco-lists">
        <div className="container">
          {!activeList ? (
            <>
              <span className="section-label">Curated Collections</span>
              <h2 className="section-title">The Weekly Curated Lists</h2>
              <p className="section-subtitle">
                Deep dives into themes, moods, and reading vibes — beyond what Instagram captions allow.
              </p>

              <div className="reco-lists__grid">
                {curatedLists.map((list, i) => (
                  <article
                    key={list.id}
                    className="reco-list-card glass-card animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1}s`, background: list.gradient }}
                    id={`curated-list-${list.id}`}
                    onClick={() => {
                      setActiveList(list);
                      document.getElementById('reco-lists').scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="reco-list-card__icon-wrapper">
                      {renderIcon(list.icon, 28)}
                    </div>
                    <h3 className="reco-list-card__title">{list.title}</h3>
                    <p className="reco-list-card__desc">{list.description}</p>
                    <div className="reco-list-card__footer">
                      <span className="reco-list-card__count">
                        <BookOpen size={14} /> {getListBooks(list.id).length} books
                      </span>
                      <span className="reco-list-card__cta">Read List →</span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="reco-list-active animate-fade-in">
              <button 
                className="btn btn-ghost" 
                onClick={() => setActiveList(null)}
                style={{ marginBottom: '1.5rem', paddingLeft: 0 }}
              >
                <ArrowLeft size={16} /> Back to All Lists
              </button>
              
              <div className="glass-card" style={{ background: activeList.gradient, padding: '2.5rem', marginBottom: '3rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                   <div style={{ color: 'var(--accent-gold)' }}>
                     {renderIcon(activeList.icon, 36)}
                   </div>
                   <h2 style={{ margin: 0, fontSize: '2rem' }}>{activeList.title}</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
                  {activeList.description}
                </p>
              </div>

              <div className="reco-quiz__results-grid">
                {getListBooks(activeList.id).map((book, i) => (
                  <BookCard key={book.id} book={book} index={i} onClick={setSelectedBook} />
                ))}
              </div>
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
