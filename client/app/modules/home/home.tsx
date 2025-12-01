import './home.scss';

import React from 'react';
import { useAppSelector } from 'app/config/store';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { PricingSection } from './sections/PricingSection';
import { ContactSection } from './sections/ContactSection';
import { FooterSection } from './sections/FooterSection';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);
  const loggedIn = !!account?.login;

  return (
    <div className="landing-page">
      <HeroSection loggedIn={loggedIn} accountLogin={account?.login} />
      <AboutSection />
      <PricingSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default Home;
