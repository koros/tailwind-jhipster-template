import React from 'react';
import { Translate } from 'react-jhipster';

export const AboutSection: React.FC = () => {
  return (
    <>
      <section id="about" className="section bg-surface fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="w-full max-w-7xl mx-auto px-4">
          <h2 className="section-title text-primary">
            <Translate contentKey="home.about.title" />
          </h2>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-lg text-secondary leading-relaxed mb-6">
              <Translate contentKey="home.about.description1" />
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              <Translate contentKey="home.about.description2" />
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-center mb-8 text-primary">
            <Translate contentKey="home.about.keyFeatures" />
          </h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h3 className="text-xl font-semibold mb-2">
                <Translate contentKey="home.about.feature1.title" />
              </h3>
              <p className="text-secondary text-sm">
                <Translate contentKey="home.about.feature1.description" />
              </p>
            </div>
            <div className="feature-card" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-semibold mb-2">
                <Translate contentKey="home.about.feature2.title" />
              </h3>
              <p className="text-secondary text-sm">
                <Translate contentKey="home.about.feature2.description" />
              </p>
            </div>
            <div className="feature-card" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold mb-2">
                <Translate contentKey="home.about.feature3.title" />
              </h3>
              <p className="text-secondary text-sm">
                <Translate contentKey="home.about.feature3.description" />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section bg-primary fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="w-full max-w-7xl mx-auto px-4">
          <h2 className="section-title text-primary">
            <Translate contentKey="home.howItWorks.title" />
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-btn-primary text-white rounded-full flex items-center justify-center text-xl font-normal">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-2 text-primary font-medium">
                    <Translate contentKey="home.howItWorks.step1.title" />
                  </h3>
                  <p className="text-secondary">
                    <Translate contentKey="home.howItWorks.step1.description" />
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center text-xl font-normal">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-2 text-primary">
                    <Translate contentKey="home.howItWorks.step2.title" />
                  </h3>
                  <p className="text-secondary">
                    <Translate contentKey="home.howItWorks.step2.description" />
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-normal">3</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-2 text-primary">
                    <Translate contentKey="home.howItWorks.step3.title" />
                  </h3>
                  <p className="text-secondary">
                    <Translate contentKey="home.howItWorks.step3.description" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
