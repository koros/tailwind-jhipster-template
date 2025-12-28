import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import { languages } from 'app/config/translation';
import { useAppSelector } from 'app/config/store';

interface SidebarProps {
  isAdmin: boolean;
  account?: any;
  currentLocale?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavItem {
  to: string;
  icon: any;
  label: string;
  adminOnly?: boolean;
}

const Sidebar = ({ isAdmin, account, currentLocale, onCollapsedChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const shouldCollapse = window.innerWidth < 768;
      setIsCollapsed(shouldCollapse);
      onCollapsedChange?.(shouldCollapse);
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onCollapsedChange]);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  const navGroups: NavGroup[] = [
    {
      title: 'Navigation',
      items: [
        { to: '/', icon: 'home', label: 'global.menu.home' },
        { to: '/dashboard', icon: 'chart-area', label: 'global.menu.account.dashboard' },
      ],
    },
    {
      title: 'Profile',
      items: [
        { to: '/account/settings', icon: 'gear', label: 'global.menu.account.settings' },
        { to: '/account/password', icon: 'lock', label: 'global.menu.account.password' },
      ],
    },
    {
      title: 'Entities',
      items: [{ to: '/todo', icon: 'clipboard-check', label: 'global.menu.entities.todo' }],
    },
    {
      title: 'Administration',
      items: [
        { to: '/admin/user-management', icon: 'user-plus', label: 'global.menu.admin.userManagement', adminOnly: true },
        { to: '/admin/health', icon: 'heart-pulse', label: 'global.menu.admin.health', adminOnly: true },
        { to: '/admin/docs', icon: ['far', 'file-code'], label: 'global.menu.admin.apidocs', adminOnly: true },
      ].filter(item => !item.adminOnly || isAdmin),
    },
  ];

  const userImage = useAppSelector(state => state.authentication.userImage);

  const getInitial = (firstName: string) => {
    return firstName?.charAt(0)?.toUpperCase() || '';
  };

  const getColorFromName = (fullName: string) => {
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      // eslint-disable-next-line no-bitwise
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 65%, 50%)`;
  };

  return (
    <div className="bg-surface overflow-y-auto flex flex-col" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Logo and Collapse Button */}
      <div className={`flex ${isCollapsed ? 'flex-col' : 'flex-row'} items-center justify-between py-4 px-4 border-b border-primary gap-2`}>
        <Link to="/" className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-2`}>
          <img src="content/images/logo-jhipster.png" alt="JHipster" className="w-8 h-8 object-contain flex-shrink-0" />
          {!isCollapsed && <span className="font-bold text-primary">JHipster</span>}
        </Link>
        <button
          type="button"
          onClick={handleToggle}
          className="sidebar-toggle-btn hover:bg-hover transition-colors"
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={isCollapsed ? 'bars' : 'angles-left'} className="w-4 h-4 text-secondary" />
        </button>
      </div>

      {/* User Card */}
      {account && (
        <div className="p-4 border-b border-primary">
          <div className={`flex ${isCollapsed ? 'flex-col' : 'flex-row'} items-center gap-3`}>
            <div className="flex-shrink-0">
              {userImage ? (
                <img src={userImage} alt={account.login} className="rounded-full border-2 border-primary w-14 h-14 object-cover" />
              ) : (
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold text-lg border-2 border-primary"
                  style={{ backgroundColor: getColorFromName(`${account.firstName || ''} ${account.lastName || ''}`.trim()) }}
                >
                  {getInitial(account.firstName)}
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary truncate">
                  {account.firstName && account.lastName
                    ? `${account.firstName.charAt(0).toUpperCase() + account.firstName.slice(1)} ${account.lastName.charAt(0).toUpperCase() + account.lastName.slice(1)}`
                    : account.login}
                </p>
                <p className="text-xs text-secondary truncate">{account.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm">{languages[currentLocale || 'en']?.flag || '🇺🇸'}</span>
                  <span className="text-xs text-secondary">{languages[currentLocale || 'en']?.name || 'English'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="p-4 space-y-6 flex-1">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {!isCollapsed && <h3 className="text-xs font-semibold text-secondary uppercase mb-2 px-2">{group.title}</h3>}
            <ul className="space-y-1">
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors',
                        isCollapsed ? 'justify-center' : 'justify-start',
                        isActive ? 'bg-hover text-[color:var(--color-primary)]' : 'text-primary hover:bg-hover hover:text-primary',
                        isCollapsed ? 'rounded-md' : 'rounded-[20px]',
                      ].join(' ')
                    }
                    title={translate(item.label)}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">
                        <Translate contentKey={item.label} />
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
