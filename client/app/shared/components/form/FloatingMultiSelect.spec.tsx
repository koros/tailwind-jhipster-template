import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FloatingMultiSelect } from './FloatingMultiSelect';

type FormValues = {
  roles: string[];
};

const options = [
  { value: 'ROLE_USER', label: 'User' },
  { value: 'ROLE_ADMIN', label: 'Administrator' },
];

const Wrapper = ({ children, defaultValues = { roles: [] } }: { children: React.ReactNode; defaultValues?: FormValues }) => {
  const methods = useForm<FormValues>({ defaultValues });
  return (
    <FormProvider {...methods}>
      <form>{children}</form>
    </FormProvider>
  );
};

const renderMultiSelect = (props?: Partial<React.ComponentProps<typeof FloatingMultiSelect>>) => {
  const result = render(
    <Wrapper>
      <FloatingMultiSelect name="roles" label="Profiles" options={options} placeholder="Select roles" {...props} />
    </Wrapper>,
  );

  const control = result.container.querySelector('.floating-multi-select-control');
  if (!(control instanceof HTMLElement)) {
    throw new Error('Floating multi-select control not found');
  }

  return { ...result, control };
};

describe('FloatingMultiSelect', () => {
  it('shows placeholder text and toggles dropdown visibility', () => {
    const { control } = renderMultiSelect();

    expect(screen.getByText('Select roles')).toBeTruthy();

    fireEvent.click(control);

    expect(screen.getByText('User')).toBeTruthy();
    expect(screen.getByText('Administrator')).toBeTruthy();
  });

  it('selects and removes values using chips', () => {
    const { control } = renderMultiSelect();

    fireEvent.click(control);
    fireEvent.click(screen.getByText('Administrator'));

    const removeButton = screen.getByLabelText('Remove Administrator');
    expect(removeButton).toBeTruthy();

    fireEvent.click(removeButton);
    expect(screen.queryByLabelText('Remove Administrator')).toBeNull();
  });

  it('filters options using the search box', () => {
    const { control, container } = renderMultiSelect();

    fireEvent.click(control);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'adm' } });

    const visibleOptions = container.querySelectorAll('.floating-multi-select-option');
    expect(visibleOptions).toHaveLength(1);
    expect(visibleOptions[0].textContent).toContain('Administrator');
  });

  it('does not open dropdown when disabled', () => {
    const { control } = renderMultiSelect({ disabled: true });

    fireEvent.click(control);

    expect(screen.queryByPlaceholderText('Search...')).toBeNull();
  });
});
