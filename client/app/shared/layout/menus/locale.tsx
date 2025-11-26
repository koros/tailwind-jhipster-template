import React, { useMemo, useState } from 'react';
import { languages, locales } from 'app/config/translation';
import { NavDropdown } from './menu-components';

export const LocaleMenu = ({ currentLocale, onClick }: { currentLocale: string; onClick: (event: any) => void }) => {
  if (Object.keys(languages).length <= 1) return null;

  const [query, setQuery] = useState('');
  const filteredLocales = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locales;
    return locales.filter(loc => {
      const code = loc.toLowerCase();
      const name = (languages[loc]?.name || '').toLowerCase();
      return code.includes(q) || name.includes(q);
    });
  }, [query]);

  return (
    <NavDropdown
      icon="language"
      name={currentLocale ? `${languages[currentLocale]?.flag || ''} ${currentLocale.toUpperCase()}` : undefined}
      style={{ maxHeight: '90vh', overflowY: 'auto' }}
    >
      <li className="px-3 py-2">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search languages"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search languages"
        />
      </li>
      {filteredLocales.length === 0 ? (
        <li className="px-4 py-2 text-sm text-gray-500">No matches</li>
      ) : (
        filteredLocales.map(locale => (
          <li key={locale}>
            <button
              type="button"
              value={locale}
              data-close-dropdown="true"
              onClick={onClick}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <span className="mr-2">{languages[locale].flag}</span>
              {locale.toUpperCase()} - {languages[locale].name}
            </button>
          </li>
        ))
      )}
    </NavDropdown>
  );
};
