import React, { useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const NavDropdown = props => {
  const [isOpen, setIsOpen] = useState(false);
  const iconOnly = !props.name;
  const containerRef = useRef<HTMLLIElement>(null);

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
          className="absolute right-0 mt-2 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50 min-w-[200px]"
          style={props.style}
          onClick={e => {
            const target = (e.target as HTMLElement).closest('[data-close-dropdown="true"]');
            if (target) {
              setIsOpen(false);
            }
          }}
        >
          {props.children}
        </ul>
      )}
    </li>
  );
};
