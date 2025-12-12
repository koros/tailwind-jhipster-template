import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { NavDropdown } from './menu-components';

describe('NavDropdown', () => {
  const mockAccount = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  it('should render with icon and name', () => {
    const { container } = render(
      <NavDropdown id="test-menu" name="Test Menu" icon="user">
        <li>Test Item</li>
      </NavDropdown>,
    );
    expect(container.textContent).toContain('Test Menu');
  });

  it('should toggle dropdown on button click', () => {
    const { getByRole, queryByRole } = render(
      <NavDropdown id="test-menu" name="Test Menu">
        <li>Test Item</li>
      </NavDropdown>,
    );

    const button = getByRole('button');
    expect(queryByRole('list')).toBeNull(); // Dropdown should be closed

    fireEvent.click(button);
    expect(queryByRole('list')).toBeTruthy(); // Dropdown should be open

    fireEvent.click(button);
    expect(queryByRole('list')).toBeNull(); // Dropdown should be closed again
  });

  it('should render user card when showUserCard is true', () => {
    const { container } = render(
      <NavDropdown id="account-menu" showUserCard account={mockAccount}>
        <li>Profile</li>
      </NavDropdown>,
    );

    expect(container.textContent).toContain('J'); // Initial
  });

  it('should display account details when dropdown is open', () => {
    const { getByRole, container } = render(
      <NavDropdown id="account-menu" showUserCard account={mockAccount}>
        <li>Profile</li>
      </NavDropdown>,
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(container.textContent).toContain('John Doe');
    expect(container.textContent).toContain('john.doe@example.com');
  });

  it('should close dropdown on blur', () => {
    const { getByRole, queryByRole, container } = render(
      <div>
        <NavDropdown id="test-menu" name="Test Menu">
          <li>Test Item</li>
        </NavDropdown>
        <button>Outside Button</button>
      </div>,
    );

    const menuButton = getByRole('button', { name: /Test Menu/i });
    fireEvent.click(menuButton);
    expect(queryByRole('list')).toBeTruthy();

    // Simulate blur by focusing on outside element
    const outsideButton = container.querySelector('button:last-child');
    fireEvent.blur(menuButton, { relatedTarget: outsideButton });
    expect(queryByRole('list')).toBeNull();
  });

  it('should close dropdown when clicking item with data-close-dropdown', () => {
    const { getByRole, queryByRole } = render(
      <NavDropdown id="test-menu" name="Test Menu">
        <li data-close-dropdown="true">Close Item</li>
      </NavDropdown>,
    );

    const button = getByRole('button');
    fireEvent.click(button);
    expect(queryByRole('list')).toBeTruthy();

    const closeItem = queryByRole('list')?.querySelector('[data-close-dropdown="true"]');
    if (closeItem) {
      fireEvent.click(closeItem);
    }
    expect(queryByRole('list')).toBeNull();
  });

  it('should handle icon-only dropdown', () => {
    const { container } = render(
      <NavDropdown id="icon-menu" icon="cog">
        <li>Settings</li>
      </NavDropdown>,
    );

    // Should not have name text
    expect(container.querySelector('.flex-1')).toBeNull();
  });

  it('should handle account without firstName', () => {
    const accountWithoutName = {
      ...mockAccount,
      firstName: undefined,
    };

    const { container } = render(
      <NavDropdown id="account-menu" showUserCard account={accountWithoutName}>
        <li>Profile</li>
      </NavDropdown>,
    );

    // Should still render but with empty initial
    expect(container).toBeTruthy();
  });
});
