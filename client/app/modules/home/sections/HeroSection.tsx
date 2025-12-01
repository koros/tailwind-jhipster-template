import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPowerOff } from '@fortawesome/free-solid-svg-icons';

interface HeroSectionProps {
  loggedIn: boolean;
  accountLogin?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ loggedIn, accountLogin }) => {
  return (
    <section className="hero-gradient min-h-screen flex flex-col justify-center items-center text-center fade-in pt-20 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4">
        <span className="hipster mb-8" />
        <h1 className="text-5xl md:text-6xl font-light tracking-tight slide-up" style={{ animationDelay: '0.1s' }}>
          {loggedIn ? (
            <Translate contentKey="home.hero.welcome" interpolate={{ username: accountLogin }} />
          ) : (
            <Translate contentKey="home.hero.title" />
          )}
        </h1>
        <p className="mt-4 text-xl md:text-2xl max-w-2xl mx-auto slide-up font-extralight" style={{ animationDelay: '0.25s' }}>
          <Translate contentKey="home.hero.subtitle" />
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 slide-up" style={{ animationDelay: '0.4s' }}>
          {!loggedIn && (
            <Link
              to="/login"
              className="px-8 py-3 rounded-full border-2 font-medium transition flex items-center gap-2"
              style={{ borderColor: '#ffc107', backgroundColor: '#ffc107', color: '#1e3a8a' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#e6ad06';
                e.currentTarget.style.borderColor = '#e6ad06';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#ffc107';
                e.currentTarget.style.borderColor = '#ffc107';
              }}
            >
              <span>
                <Translate contentKey="home.hero.login" />
              </span>
              <FontAwesomeIcon icon={faPowerOff} aria-hidden="true" />
            </Link>
          )}
          {!loggedIn && (
            <Link
              to="/account/register"
              className="px-8 py-3 rounded-full border-2 border-white text-white font-medium hover:bg-white hover:text-indigo-600 transition flex items-center gap-2"
            >
              <span>
                <Translate contentKey="home.hero.getStarted" />
              </span>
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
          )}
          {loggedIn && (
            <Link
              to="/dashboard"
              className="px-8 py-3 rounded-full border-2 border-white text-white font-medium hover:bg-white hover:text-indigo-600 transition flex items-center gap-2"
            >
              <span>
                <Translate contentKey="home.hero.dashboard" />
              </span>
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
          )}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-8 slide-up" style={{ animationDelay: '0.55s' }}>
          <a href="#about" className="underline hover:text-indigo-200 text-white">
            <Translate contentKey="home.hero.learnMore" />
          </a>
          <a href="#pricing" className="underline hover:text-indigo-200 text-white">
            <Translate contentKey="home.hero.pricing" />
          </a>
          <a href="#contact" className="underline hover:text-indigo-200 text-white">
            <Translate contentKey="home.hero.contact" />
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none" style={{ marginBottom: '-1px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="block w-full h-auto">
          <path
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,224L80,234.7C160,245,320,267,480,282.7C640,299,800,309,960,309.3C1120,309,1280,299,1360,293.3L1440,288L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};
