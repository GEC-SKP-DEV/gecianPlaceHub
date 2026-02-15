'use client';

import React from 'react';

export interface CategoryFieldProps {
  category: {
    categoryId: number;
    categoryName: string;
    inputType: 'single-select' | 'multi-select' | 'range-slider' | 'text';
    minValue?: number;
    maxValue?: number;
    options: Array<{ optionId: number; optionName: string }>;
  };
  value: string | string[] | number;
  onChange: (value: string | string[] | number) => void;
  required?: boolean;
  className?: string;
}

const CategoryField: React.FC<CategoryFieldProps> = ({
  category,
  value,
  onChange,
  required = false,
  className = '',
}) => {
  const { inputType, categoryName, options, minValue, maxValue } = category;

  switch (inputType) {
    case 'text':
      return (
        <div className={className}>
          <label htmlFor={`field-${category.categoryId}`} className="block text-sm font-medium text-gray-700 mb-2">
            {categoryName}
            {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            id={`field-${category.categoryId}`}
            name={`field-${category.categoryId}`}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required={required}
          />
        </div>
      );

    case 'single-select':
      return (
        <div className={className}>
          <label htmlFor={`field-${category.categoryId}`} className="block text-sm font-medium text-gray-700 mb-2">
            {categoryName}
            {required && <span className="text-red-500">*</span>}
          </label>
          <select
            id={`field-${category.categoryId}`}
            name={`field-${category.categoryId}`}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required={required}
          >
            <option value="">-- Select {categoryName} --</option>
            {options.map((option) => (
              <option key={option.optionId} value={option.optionName}>
                {option.optionName}
              </option>
            ))}
          </select>
        </div>
      );

    case 'multi-select':
      const selectedValues = Array.isArray(value) ? value : (typeof value === 'string' && value ? [value] : []);
      return (
        <div className={className}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {categoryName}
            {required && <span className="text-red-500">*</span>}
          </label>
          <div className="border border-gray-300 rounded-md p-3 space-y-2 bg-white max-h-48 overflow-y-auto">
            {options.length > 0 ? (
              options.map((option) => (
                <label key={option.optionId} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.optionName)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange([...selectedValues, option.optionName]);
                      } else {
                        onChange(selectedValues.filter((v) => v !== option.optionName));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.optionName}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No options available</p>
            )}
          </div>
        </div>
      );

    case 'range-slider':
      const sliderValue = typeof value === 'number' ? value : minValue || 0;
      return (
        <div className={className}>
          <label htmlFor={`field-${category.categoryId}`} className="block text-sm font-medium text-gray-700 mb-2">
            {categoryName}: {sliderValue}
            {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="range"
            id={`field-${category.categoryId}`}
            name={`field-${category.categoryId}`}
            min={minValue || 0}
            max={maxValue || 100}
            value={sliderValue}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            required={required}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{minValue || 0}</span>
            <span>{maxValue || 100}</span>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default CategoryField;
