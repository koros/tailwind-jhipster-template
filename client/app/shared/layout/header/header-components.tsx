import React from 'react';
import { Translate } from 'react-jhipster';

import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/logo-jhipster.png" alt="Logo" />
  </div>
);

export const Brand = () => (
  <Link to="/" className="brand-logo flex items-center space-x-2 text-white no-underline hover:opacity-80">
    <BrandIcon />
    <span className="brand-title font-semibold">
      <Translate contentKey="global.title">MyTailwindJhipster</Translate>
    </span>
    <span className="navbar-version text-sm opacity-75">{VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`}</span>
  </Link>
);

export const Home = () => (
  <li>
    <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded text-white hover:bg-gray-700 no-underline">
      <FontAwesomeIcon icon="home" />
      <span>
        <Translate contentKey="global.menu.home">Home</Translate>
      </span>
    </Link>
  </li>
);
