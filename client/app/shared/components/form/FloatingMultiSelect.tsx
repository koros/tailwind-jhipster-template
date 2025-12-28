import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface FloatingMultiSelectProps {
  name: string;
  label: string;
  options: MultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  validate?: RegisterOptions['validate'];
}

export const FloatingMultiSelect: React.FC<FloatingMultiSelectProps> = ({
  name,
  label,
  options,
  placeholder,
  disabled = false,
  validate,
}) => {
  const { control } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedOptions = useMemo(() => options, [options]);

  return (
    <Controller
      control={control}
      name={name}
      rules={{ validate }}
      render={({ field, fieldState }) => {
        const selectedValues: string[] = Array.isArray(field.value) ? field.value : field.value ? [field.value] : [];

        const selectedMap = new Map(normalizedOptions.map(option => [option.value, option.label]));

        const toggleValue = (value: string) => {
          if (disabled) return;
          if (selectedValues.includes(value)) {
            field.onChange(selectedValues.filter(v => v !== value));
          } else {
            field.onChange([...selectedValues, value]);
          }
        };

        const removeValue = (value: string) => {
          if (disabled) return;
          field.onChange(selectedValues.filter(v => v !== value));
        };

        const filteredOptions = normalizedOptions.filter(option => option.label.toLowerCase().includes(search.trim().toLowerCase()));

        const isFocused = isOpen || selectedValues.length > 0;

        return (
          <div ref={containerRef} className={`floating-multi-select form-group floating-group w-100 ${isFocused ? 'focused' : ''}`}>
            <label className="floating-label">{label}</label>
            <div
              className={`floating-control floating-multi-select-control min-h-[55px] border rounded-md px-3 pt-4 pb-2 cursor-pointer flex flex-wrap gap-2 items-center ${
                fieldState.error ? 'has-error' : ''
              } ${disabled ? 'is-disabled' : ''} ${isOpen ? 'is-open' : ''}`}
              onClick={() => {
                if (!disabled) {
                  setIsOpen(prev => !prev);
                }
              }}
            >
              {selectedValues.length === 0 && placeholder ? (
                <span className="floating-multi-select-placeholder text-sm">{placeholder}</span>
              ) : (
                selectedValues.map(value => (
                  <span
                    key={value}
                    className="floating-multi-select-chip inline-flex items-center gap-1 rounded-full text-xs font-medium px-3 py-1 mt-2"
                  >
                    {selectedMap.get(value) || value}
                    {!disabled && (
                      <button
                        type="button"
                        className="floating-multi-select-chip-remove"
                        onClick={e => {
                          e.stopPropagation();
                          removeValue(value);
                        }}
                        aria-label={`Remove ${selectedMap.get(value) || value}`}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))
              )}
            </div>
            {isOpen && !disabled && (
              <div className="floating-multi-select-dropdown mt-2 w-full rounded-md border shadow-lg z-20 max-h-60 overflow-auto">
                <div className="floating-multi-select-search-wrapper p-2">
                  <input
                    type="text"
                    className="floating-multi-select-search w-full rounded-md px-2 py-1 text-sm focus:outline-none"
                    placeholder="Search..."
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                  />
                </div>
                <ul className="floating-multi-select-options max-h-48 overflow-y-auto">
                  {filteredOptions.length === 0 ? (
                    <li className="floating-multi-select-empty px-4 py-2 text-sm">No options</li>
                  ) : (
                    filteredOptions.map(option => {
                      const checked = selectedValues.includes(option.value);
                      return (
                        <li
                          key={option.value}
                          className={`floating-multi-select-option px-4 py-2 text-sm flex items-center gap-3 cursor-pointer transition-colors ${
                            checked ? 'is-selected' : ''
                          }`}
                          onClick={() => toggleValue(option.value)}
                        >
                          <input type="checkbox" readOnly checked={checked} className="floating-multi-select-checkbox h-4 w-4 rounded" />
                          <span>{option.label}</span>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            )}
            {fieldState.error && <div className="invalid-feedback d-block">{fieldState.error.message}</div>}
          </div>
        );
      }}
    />
  );
};
