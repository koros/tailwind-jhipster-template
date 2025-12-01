import React from 'react';
import { Translate } from 'react-jhipster';

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="section fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="w-full max-w-7xl mx-auto px-4">
        <h2 className="section-title">
          <Translate contentKey="home.pricing.title" />
        </h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="text-lg font-semibold">
              <Translate contentKey="home.pricing.starter.name" />
            </h3>
            <div className="pricing-price">
              <Translate contentKey="home.pricing.starter.price" />
            </div>
            <ul className="text-gray-600 text-sm flex-grow space-y-2 text-left">
              <li>
                • <Translate contentKey="home.pricing.starter.features.0" />
              </li>
              <li>
                • <Translate contentKey="home.pricing.starter.features.1" />
              </li>
              <li>
                • <Translate contentKey="home.pricing.starter.features.2" />
              </li>
            </ul>
            <button className="mt-4 px-4 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-700">
              <Translate contentKey="home.pricing.starter.cta" />
            </button>
          </div>
          <div className="pricing-card highlight">
            <h3 className="text-lg font-semibold">
              <Translate contentKey="home.pricing.pro.name" />
            </h3>
            <div className="pricing-price">
              <Translate contentKey="home.pricing.pro.price" />
            </div>
            <ul className="text-gray-600 text-sm flex-grow space-y-2 text-left">
              <li>
                • <Translate contentKey="home.pricing.pro.features.0" />
              </li>
              <li>
                • <Translate contentKey="home.pricing.pro.features.1" />
              </li>
              <li>
                • <Translate contentKey="home.pricing.pro.features.2" />
              </li>
              <li>
                • <Translate contentKey="home.pricing.pro.features.3" />
              </li>
            </ul>
            <button className="mt-4 px-4 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-500">
              <Translate contentKey="home.pricing.pro.cta" />
            </button>
          </div>
          <div className="pricing-card">
            <h3 className="text-lg font-semibold">
              <Translate contentKey="home.pricing.enterprise.name" />
            </h3>
            <div className="pricing-price">
              <Translate contentKey="home.pricing.enterprise.price" />
            </div>
            <ul className="text-gray-600 text-sm flex-grow space-y-2 text-left">
              <li>
                • <Translate contentKey="home.pricing.enterprise.features.0" />
              </li>
              <li>
                • <Translate contentKey="home.pricing.enterprise.features.1" />
              </li>
              <li>
                • <Translate contentKey="home.pricing.enterprise.features.2" />
              </li>
              <li>
                • <Translate contentKey="home.pricing.enterprise.features.3" />
              </li>
            </ul>
            <button className="mt-4 px-4 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-700">
              <Translate contentKey="home.pricing.enterprise.cta" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
