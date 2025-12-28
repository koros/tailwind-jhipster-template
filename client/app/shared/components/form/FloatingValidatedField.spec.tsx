import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FloatingValidatedField } from './FloatingValidatedField';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form>{children}</form>
    </FormProvider>
  );
};

describe('FloatingValidatedField', () => {
  it('renders correctly with label', () => {
    render(
      <TestWrapper>
        <FloatingValidatedField name="testField" label="Test Label" />
      </TestWrapper>,
    );

    expect(screen.getByText('Test Label')).toBeTruthy();
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('renders password field and toggles visibility', () => {
    const { container } = render(
      <TestWrapper>
        <FloatingValidatedField name="passwordField" label="Password" type="password" />
      </TestWrapper>,
    );

    const input = container.querySelector('input');
    expect(input?.getAttribute('type')).toBe('password');

    const toggleBtn = container.querySelector('.passwrd-svgs');
    expect(toggleBtn).not.toBeNull();

    // Click to show password
    act(() => {
      if (toggleBtn) {
        fireEvent.click(toggleBtn);
      }
    });

    expect(input?.getAttribute('type')).toBe('text');

    // Click to hide password
    act(() => {
      if (toggleBtn) {
        fireEvent.click(toggleBtn);
      }
    });

    expect(input?.getAttribute('type')).toBe('password');
  });

  it('does not show toggle for non-password fields', () => {
    const { container } = render(
      <TestWrapper>
        <FloatingValidatedField name="textField" label="Text" type="text" />
      </TestWrapper>,
    );

    const toggleBtn = container.querySelector('.passwrd-svgs');
    expect(toggleBtn).toBeNull();
  });
});
