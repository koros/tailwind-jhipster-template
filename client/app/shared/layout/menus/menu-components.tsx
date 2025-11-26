import React, { useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const NavDropdown = props => {
  const [isOpen, setIsOpen] = useState(false);
  const iconOnly = !props.name;
  const containerRef = useRef<HTMLLIElement>(null);
  const { showUserCard, account } = props;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <li
      ref={containerRef}
      className="relative"
      id={props.id}
      data-cy={props['data-cy']}
      tabIndex={-1}
      onBlur={e => {
        const next = e.relatedTarget as Node | null;
        if (!next || !e.currentTarget.contains(next)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={props.ariaLabel || props.name}
        className={
          iconOnly
            ? 'flex items-center justify-center w-9 h-9 rounded-full text-white hover:bg-gray-700'
            : 'flex items-center gap-2 px-3 py-2 rounded text-white hover:bg-gray-700 w-full text-left'
        }
      >
        {props.icon && <FontAwesomeIcon icon={props.icon} />}
        {props.name ? <span className="flex-1">{props.name}</span> : null}
      </button>
      {isOpen && (
        <ul
          className="absolute right-0 mt-2 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50 min-w-[240px] divide-y divide-gray-200"
          style={props.style}
          onClick={e => {
            const target = (e.target as HTMLElement).closest('[data-close-dropdown="true"]');
            if (target) {
              setIsOpen(false);
            }
          }}
        >
          {showUserCard && account && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-semibold text-sm">
                {getInitials(account.firstName, account.lastName)}
                <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {account.firstName} {account.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">{account.email}</p>
              </div>
            </div>
          )}
          {props.children}
        </ul>
      )}
    </li>
  );
};
