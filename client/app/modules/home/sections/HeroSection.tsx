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
        <div className="mt-8 pb-16 flex flex-wrap justify-center gap-4 slide-up" style={{ animationDelay: '0.4s' }}>
          {!loggedIn && (
            <Link
              to="/login"
              className="px-8 py-3 rounded-full border-2 font-medium transition flex items-center gap-2 bg-warning border-warning text-blue-900 hover:opacity-90"
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
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none" style={{ marginBottom: '-1px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="block w-full h-auto">
          {/* Decorative wave lines with subtle opacity */}
          <g style={{ opacity: 0.6 }}>
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
            {/* Additional dense lines near the bottom for a tighter wave effect */}
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,220L48,228C96,236,192,250,288,246C384,242,480,226,576,214C672,206,768,210,864,222C960,234,1056,246,1152,246C1248,246,1344,238,1392,232L1440,228"
            />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,214L48,222C96,230,192,244,288,241C384,238,480,224,576,212C672,204,768,208,864,218C960,228,1056,240,1152,240C1248,240,1344,232,1392,227L1440,224"
            />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,208L48,216C96,224,192,238,288,236C384,234,480,222,576,210C672,202,768,206,864,214C960,222,1056,234,1152,234C1248,234,1344,229,1392,225L1440,224"
            />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,202L48,210C96,218,192,232,288,231C384,230,480,220,576,208C672,200,768,204,864,210C960,216,1056,228,1152,228C1248,228,1344,226,1392,223L1440,222"
            />
            {/* Extra dense waves for an even richer bottom effect */}
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,198 C120,216 240,234 360,220 C480,206 600,180 720,200 C840,220 960,240 1080,230 C1200,220 1320,205 1440,212"
            />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,194 C140,210 280,226 420,215 C560,204 700,185 840,205 C980,225 1120,235 1260,228 C1380,221 1410,212 1440,218"
            />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,190 C160,208 320,226 480,212 C640,198 800,178 960,200 C1120,222 1280,232 1440,217"
            />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,186 C180,204 360,222 540,210 C720,198 900,175 1080,198 C1260,221 1350,228 1440,216"
            />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,182 C200,200 400,218 600,208 C800,198 1000,188 1200,205 C1320,215 1380,218 1440,214"
            />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,178 C220,196 440,214 660,206 C880,198 1100,190 1320,208 C1380,214 1410,215 1440,212"
            />
            <path
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              d="M0,174 C240,192 480,210 720,202 C960,194 1200,198 1440,210"
            />
          </g>
          {/* Curved bottom fill matching the next section background */}
          <path
            fill="var(--color-surface)"
            fillOpacity="1"
            d="M0,224L80,234.7C160,245,320,267,480,282.7C640,299,800,309,960,309.3C1120,309,1280,299,1360,293.3L1440,288L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};
