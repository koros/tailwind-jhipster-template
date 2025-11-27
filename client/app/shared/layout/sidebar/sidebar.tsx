import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';

interface SidebarProps {
  isAdmin: boolean;
  account?: any;
  currentLocale?: string;
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

const Sidebar = ({ isAdmin, account, currentLocale }: SidebarProps) => {
  const getLanguageCode = (locale: string) => {
    return locale?.toUpperCase().split('-')[0] || 'EN';
  };

  const getFlagEmoji = (locale: string) => {
    const countryCode = locale?.split('-')[1] || locale;
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const navGroups: NavGroup[] = [
    {
      title: 'Navigation',
      items: [
        { to: '/', icon: 'home', label: 'global.menu.home' },
        { to: '/dashboard', icon: 'list', label: 'global.menu.account.dashboard' },
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
        { to: '/admin/user-management', icon: 'users-cog', label: 'global.menu.admin.userManagement', adminOnly: true },
        { to: '/admin/health', icon: 'heart', label: 'global.menu.admin.health', adminOnly: true },
        { to: '/admin/docs', icon: 'book', label: 'global.menu.admin.apidocs', adminOnly: true },
      ].filter(item => !item.adminOnly || isAdmin),
    },
  ];

  return (
    <div className="bg-gray-200 overflow-y-auto flex flex-col" style={{ minHeight: 'calc(100vh - 60px)' }}>
      {/* JHipster Logo */}
      <Link to="/" className="flex items-center justify-center lg:justify-start gap-2 py-4 px-4 border-b border-white">
        <img src="content/images/logo-jhipster.png" alt="JHipster" className="w-8 h-8 object-contain flex-shrink-0" />
        <span className="hidden lg:block font-bold text-gray-900">JHipster</span>
      </Link>

      {/* User Card */}
      {account && (
        <div className="p-4 border-b border-white">
          <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3">
            <div className="flex-shrink-0">
              <img
                src="content/images/jhipster_family_member_1.svg"
                alt={account.login}
                className="rounded-full border-2 border-blue-500 w-12 h-12"
              />
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{account.login}</p>
              <p className="text-xs text-gray-600 truncate">{account.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm">{getFlagEmoji(currentLocale || 'en')}</span>
                <span className="text-xs text-gray-600">{getLanguageCode(currentLocale || 'en')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="p-4 space-y-6 flex-1">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="hidden lg:block text-xs font-semibold text-gray-500 uppercase mb-2 px-2">{group.title}</h3>
            <ul className="space-y-1">
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-center lg:justify-start gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                    title={item.label}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden lg:inline truncate">
                      <Translate contentKey={item.label} />
                    </span>
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
