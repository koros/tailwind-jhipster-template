import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Theme Switcher"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{currentTheme.icon}</span>
        <span className="hidden md:inline">{currentTheme.name}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {availableThemes.map(theme => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  currentTheme.id === theme.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                role="menuitem"
              >
                <span className="text-2xl">{theme.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{theme.name}</div>
                  <div className="flex gap-1 mt-1">
                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: theme.colors.secondary }} />
                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: theme.colors.accent }} />
                  </div>
                </div>
                {currentTheme.id === theme.id && (
                  <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
