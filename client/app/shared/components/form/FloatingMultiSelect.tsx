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
          <div ref={containerRef} className={`form-group floating-group w-100 ${isFocused ? 'focused' : ''}`}>
            <label className="floating-label">{label}</label>
            <div
              className={`floating-control min-h-[55px] border rounded-md px-3 pt-4 pb-2 cursor-pointer flex flex-wrap gap-2 items-center ${
                fieldState.error ? 'border-red-500' : 'border-gray-300'
              } ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900'}`}
              onClick={() => {
                if (!disabled) {
                  setIsOpen(prev => !prev);
                }
              }}
            >
              {selectedValues.length === 0 && placeholder ? (
                <span className="text-sm text-gray-400">{placeholder}</span>
              ) : (
                selectedValues.map(value => (
                  <span
                    key={value}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 mt-2"
                  >
                    {selectedMap.get(value) || value}
                    {!disabled && (
                      <button
                        type="button"
                        className="text-gray-500 hover:text-red-500"
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
              <div className="mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg z-20 max-h-60 overflow-auto">
                <div className="p-2 border-b border-gray-100">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Search..."
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                  />
                </div>
                <ul className="max-h-48 overflow-y-auto">
                  {filteredOptions.length === 0 ? (
                    <li className="px-4 py-2 text-sm text-gray-500">No options</li>
                  ) : (
                    filteredOptions.map(option => {
                      const checked = selectedValues.includes(option.value);
                      return (
                        <li
                          key={option.value}
                          className={`px-4 py-2 text-sm flex items-center gap-3 cursor-pointer transition-colors ${
                            checked ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleValue(option.value)}
                        >
                          <input
                            type="checkbox"
                            readOnly
                            checked={checked}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
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
