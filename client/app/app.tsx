import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs';

import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Card } from 'app/shared/components';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession, getUserImage } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import Header from 'app/shared/layout/header/header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import { setTextDirection } from './config/translation';
import { ThemeProvider } from './shared/layout/theme/ThemeContext';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

const AppContent = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);
  const userImage = useAppSelector(state => state.authentication.userImage);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserImage());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    setTextDirection(currentLocale);
  }, [currentLocale]);

  const isHomePage = location.pathname === '/' || location.pathname === '';
  const paddingTop = isHomePage ? '0px' : '60px';

  return (
    <div className="box-border" style={{ paddingTop }}>
      <ToastContainer position="top-left" className="toastify-container" toastClassName="toastify-toast" />
      <ErrorBoundary>
        <Header
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          currentLocale={currentLocale}
          ribbonEnv={ribbonEnv}
          isInProduction={isInProduction}
          isOpenAPIEnabled={isOpenAPIEnabled}
          account={account}
          userImage={userImage}
        />
      </ErrorBoundary>
      <div className="w-full" id="app-view-container" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter basename={baseHref}>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
