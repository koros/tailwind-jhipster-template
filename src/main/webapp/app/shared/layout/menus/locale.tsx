import React from 'react';
import { languages, locales } from 'app/config/translation';
import { NavDropdown } from './menu-components';

export const LocaleMenu = ({ currentLocale, onClick }: { currentLocale: string; onClick: (event: any) => void }) =>
  Object.keys(languages).length > 1 ? (
    <NavDropdown icon="flag" name={currentLocale ? languages[currentLocale].name : undefined}>
      {locales.map(locale => (
        <li key={locale}>
          <button type="button" value={locale} onClick={onClick} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
            {languages[locale].name}
          </button>
        </li>
      ))}
    </NavDropdown>
  ) : null;
