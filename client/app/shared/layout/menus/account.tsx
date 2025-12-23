import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

const accountMenuItemsAuthenticated = () => (
  <>
    <MenuItem icon="chart-area" to="/dashboard" data-cy="dashboard">
      <Translate contentKey="global.menu.account.dashboard">Dashboard</Translate>
    </MenuItem>
    <MenuItem icon="gear" to="/account/settings" data-cy="settings">
      <Translate contentKey="global.menu.account.settings">Settings</Translate>
    </MenuItem>
    <MenuItem icon="lock" to="/account/password" data-cy="passwordItem">
      <Translate contentKey="global.menu.account.password">Password</Translate>
    </MenuItem>
    <MenuItem icon="power-off" to="/logout" data-cy="logout">
      <Translate contentKey="global.menu.account.logout">Sign out</Translate>
    </MenuItem>
  </>
);

export const AccountMenu = ({ isAuthenticated = false, account = null, userImage = null }) =>
  isAuthenticated ? (
    <NavDropdown
      icon={undefined}
      name={undefined}
      ariaLabel={translate('global.menu.account.main')}
      id="account-menu"
      data-cy="accountMenu"
      showUserCard={true}
      account={account}
      userImage={userImage}
    >
      {accountMenuItemsAuthenticated()}
    </NavDropdown>
  ) : null;

export default AccountMenu;
