import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const NavDropdown = props => {
  const [isOpen, setIsOpen] = useState(false);
  const iconOnly = !props.name;

  return (
    <li className="relative" id={props.id} data-cy={props['data-cy']}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
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
          className="absolute right-0 mt-2 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50 min-w-[200px]"
          style={props.style}
        >
          {props.children}
        </ul>
      )}
    </li>
  );
};
