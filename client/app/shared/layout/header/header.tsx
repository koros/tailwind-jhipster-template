import './header.scss';

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Storage, Translate } from 'react-jhipster';
import LoadingBar from 'react-redux-loading-bar';

import { useAppDispatch } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import { AccountMenu, LocaleMenu } from '../menus';
import { Brand } from './header-components';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
  account?: any;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const dispatch = useAppDispatch();

  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    dispatch(setLocale(langKey));
  };

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
        </a>
      </div>
    ) : null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const isHomePage = location.pathname === '/' || location.pathname === '';

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const navbarBg = isHomePage ? 'bg-transparent' : '';
  const navbarStyle = isHomePage ? (scrolled ? { backgroundColor: '#9c27b0' } : {}) : { backgroundColor: '#353d47' };

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div id="app-header" className="bg-transparent">
      {renderDevRibbon()}
      <LoadingBar className="loading-bar" />
      <nav data-cy="navbar" className={`jh-navbar fixed top-0 left-0 right-0 text-white z-50 ${navbarBg}`} style={navbarStyle}>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            aria-label="Menu"
            onClick={toggleMenu}
            className="md:hidden p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Brand />
          <div
            className={`${menuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-full left-0 right-0 md:top-auto bg-gray-900 md:bg-transparent`}
          >
            <ul
              id="header-tabs"
              className="flex flex-col md:flex-row md:items-center md:ml-auto space-y-2 md:space-y-0 md:space-x-1 p-4 md:p-0"
            >
              <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
              {props.isAuthenticated && <AccountMenu isAuthenticated={props.isAuthenticated} account={props.account} />}
              {!props.isAuthenticated && (
                <>
                  <li className="md:hidden">
                    <Link to="/login" className="block px-4 py-2 rounded text-white hover:bg-gray-700" data-cy="login-mobile">
                      Sign in
                    </Link>
                  </li>
                  <li className="md:hidden">
                    <Link
                      to="/account/register"
                      className="block px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                      data-cy="register-mobile"
                    >
                      Get Started
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          {!props.isAuthenticated && (
            <div className="hidden md:flex items-center space-x-3 ml-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium rounded bg-white text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Sign in
              </Link>
              <Link
                to="/account/register"
                className="px-4 py-2 text-sm font-medium rounded bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
