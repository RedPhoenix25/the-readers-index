import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { Heart, Users, BookOpen, MapPin, ArrowRight, Check, Circle, Clock, Sparkles } from 'lucide-react';
import { timelineEvents } from '../../data/books';
import './LibraryVision.css';

function TimelineItem({ event, index }) {
  const statusIcons = {
    completed: <Check size={16} />,
    current: <Circle size={16} className="timeline-pulse" />,
    upcoming: <Clock size={14} />,
  };

  const renderIcon = (iconName, size = 20) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={size} strokeWidth={1.5} /> : null;
  };

  return (
    <div
      className={`timeline-item timeline-item--${event.status} animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.15}s` }}
      id={`timeline-${event.year}`}
    >
      <div className="timeline-item__marker">
        <div className="timeline-item__icon">
          {statusIcons[event.status]}
        </div>
        <div className="timeline-item__line" />
      </div>
      <div className="timeline-item__content glass-card">
        {event.year && <span className="timeline-item__year">{event.year}</span>}
        <div className="timeline-item__icon-badge">
          {renderIcon(event.icon, 20)}
        </div>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        {event.status === 'current' && (
          <span className="timeline-item__badge badge">You are here</span>
        )}
      </div>
    </div>
  );
}

export default function LibraryVision() {
  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="vision-hero" id="vision-hero">
        <div className="container">
          <span className="section-label">The Dream</span>
          <h1 className="section-title">
            From Digital Pages to a<br />
            <span className="text-gradient">Physical Sanctuary</span>
          </h1>
          <p className="section-subtitle">
            Every great library started with a single bookshelf. This is our journey
            from an Instagram page to a real, breathing home for stories and readers.
          </p>
        </div>
      </section>

      {/* The Story */}
      <section className="section vision-story" id="vision-story">
        <div className="container">
          <div className="vision-story__card glass-card">
            <div className="vision-story__content">
              <span className="section-label">Our Story</span>
              <h2>Why We're Building This</h2>
              <p>
                It started with a simple belief: that books have the power to change lives,
                and that every community deserves a sanctuary where stories are shared,
                discovered, and celebrated.
              </p>
              <p>
                We began sharing reviews on Instagram — short reflections on books that
                moved us, challenged us, made us laugh or cry. The response was overwhelming.
                Thousands of readers joined the conversation, sharing their own stories and
                recommendations.
              </p>
              <p>
                But Instagram isn't enough. Stories deserve more than a fleeting caption.
                They deserve a home — first digital, then physical. That's what we're building:
                a library that belongs to its community, where every shelf tells a story and
                every reader is welcome.
              </p>
            </div>
            <div className="vision-story__visual">
              <div className="vision-story__icon-stack">
                <BookOpen size={100} strokeWidth={0.5} className="vision-story__big-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section vision-timeline" id="vision-timeline">
        <div className="container">
          <div className="text-center">
            <span className="section-label">The Roadmap</span>
            <h2 className="section-title">Our Journey, Step by Step</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              From a seed of an idea to the doors of a real library.
            </p>
          </div>

          <div className="timeline">
            {timelineEvents.map((event, i) => (
              <TimelineItem key={i} event={event} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Impact / Stats */}
      <section className="section vision-impact" id="vision-impact">
        <div className="container">
          <div className="text-center">
            <span className="section-label">Community Impact</span>
            <h2 className="section-title">Together We're Building Something Special</h2>
          </div>

          <div className="vision-impact__grid">
            <div className="impact-card glass-card animate-fade-in-up delay-1">
              <Users size={32} strokeWidth={1} className="impact-card__icon" />
              <span className="impact-card__number">2,400+</span>
              <span className="impact-card__label">Readers in our community</span>
            </div>
            <div className="impact-card glass-card animate-fade-in-up delay-2">
              <BookOpen size={32} strokeWidth={1} className="impact-card__icon" />
              <span className="impact-card__number">150+</span>
              <span className="impact-card__label">Books reviewed and shared</span>
            </div>
            <div className="impact-card glass-card animate-fade-in-up delay-3">
              <Heart size={32} strokeWidth={1} className="impact-card__icon" />
              <span className="impact-card__number">12k+</span>
              <span className="impact-card__label">Reading recommendations made</span>
            </div>
            <div className="impact-card glass-card animate-fade-in-up delay-4">
              <MapPin size={32} strokeWidth={1} className="impact-card__icon" />
              <span className="impact-card__number">1</span>
              <span className="impact-card__label">
                Library coming soon <Sparkles size={12} style={{ display: 'inline', color: 'var(--accent-gold)', marginLeft: '4px' }} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section vision-cta" id="vision-cta">
        <div className="container">
          <div className="vision-cta__card">
            <h2>Be Part of the Story</h2>
            <p>
              Every follower, every shared review, every book discussed — it all brings us
              one step closer. Here's how you can help make this dream a reality.
            </p>
            <div className="vision-cta__actions">
              <Link to="/coming-soon" className="btn btn-primary" id="vision-support-btn">
                Support the Shop <ArrowRight size={16} />
              </Link>
              <a href="#" className="btn btn-secondary" id="vision-share-btn">
                Spread the Word
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
