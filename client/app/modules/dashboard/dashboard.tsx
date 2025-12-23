import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import Sidebar from 'app/shared/layout/sidebar/sidebar';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const account = useAppSelector(state => state.authentication.account);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  return (
    <div className="flex h-screen overflow-hidden" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Sidebar */}
      <div className={`transition-all duration-300 flex-shrink-0 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <Sidebar isAdmin={isAdmin} account={account} currentLocale={currentLocale} onCollapsedChange={setIsSidebarCollapsed} />
      </div>
      {/* Main Content */}
      <div className="flex-1 bg-primary overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
