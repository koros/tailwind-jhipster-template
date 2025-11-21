import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface IMenuItem {
  children: React.ReactNode;
  icon: IconProp;
  to: string;
  id?: string;
  'data-cy'?: string;
}

const MenuItem = (props: IMenuItem) => {
  const { to, icon, id, children } = props;

  return (
    <li>
      <Link
        to={to}
        id={id}
        data-cy={props['data-cy']}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 no-underline transition-colors"
      >
        <FontAwesomeIcon icon={icon} fixedWidth /> {children}
      </Link>
    </li>
  );
};

export default MenuItem;
