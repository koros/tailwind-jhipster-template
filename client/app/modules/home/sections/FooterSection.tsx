import React from 'react';
import { Translate } from 'react-jhipster';

export const FooterSection: React.FC = () => {
  return (
    <footer className="footer">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <a href="#about" className="hover:text-gray-700">
            <Translate contentKey="home.footer.about" />
          </a>
          <a href="#how-it-works" className="hover:text-gray-700">
            <Translate contentKey="home.footer.howItWorks" />
          </a>
          <a href="#pricing" className="hover:text-gray-700">
            <Translate contentKey="home.footer.pricing" />
          </a>
          <a href="#contact" className="hover:text-gray-700">
            <Translate contentKey="home.footer.contact" />
          </a>
          <a
            href="https://github.com/jhipster/generator-jhipster"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700"
          >
            GitHub
          </a>
        </div>
        <p>
          &copy; {new Date().getFullYear()} <Translate contentKey="home.footer.copyright" />
        </p>
      </div>
    </footer>
  );
};
