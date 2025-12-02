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
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="block w-full h-auto" style={{ opacity: 0.6 }}>
          <path
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,213.3C672,203,768,213,864,229.3C960,245,1056,267,1152,266.7C1248,267,1344,245,1392,234.7L1440,224"
          />
          <path
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            d="M0,224L48,234.7C96,245,192,267,288,261.3C384,256,480,224,576,202.7C672,181,768,171,864,181.3C960,192,1056,224,1152,234.7C1248,245,1344,235,1392,229.3L1440,224"
          />
          <path
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            d="M0,192L48,208C96,224,192,256,288,256C384,256,480,224,576,192C672,160,768,128,864,133.3C960,139,1056,181,1152,202.7C1248,224,1344,224,1392,224L1440,224"
          />
          <path
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            d="M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,181.3C672,139,768,85,864,85.3C960,85,1056,139,1152,170.7C1248,203,1344,213,1392,218.7L1440,224"
          />
          <path
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            d="M0,128L48,154.7C96,181,192,235,288,245.3C384,256,480,224,576,170.7C672,117,768,43,864,37.3C960,32,1056,96,1152,138.7C1248,181,1344,203,1392,213.3L1440,224"
          />
          <path
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            d="M0,96L48,128C96,160,192,224,288,240C384,256,480,224,576,160C672,96,768,0,864,0C960,0,1056,96,1152,149.3C1248,203,1344,213,1392,218.7L1440,224"
          />
          {/* Bottom fill to transition to next section if needed, or just decorative lines */}
          <path
            fill="url(#gradient)"
            fillOpacity="0.1"
            d="M0,320L48,320C96,320,192,320,288,320C384,320,480,320,576,320C672,320,768,320,864,320C960,320,1056,320,1152,320C1248,320,1344,320,1392,320L1440,320L1440,224L1392,224C1344,224,1248,224,1152,224C1056,224,960,224,864,224C768,224,672,224,576,224C480,224,384,224,288,224C192,224,96,224,48,224L0,224Z"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};
