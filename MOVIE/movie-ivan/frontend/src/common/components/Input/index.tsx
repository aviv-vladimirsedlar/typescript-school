import clsx from 'clsx';
import React from 'react';

import { InputProps } from './types';

const Input: React.FC<InputProps> = ({
  'data-testid': testId,
  className,
  classNameInput,
  error,
  label,
  name,
  onChange,
  required = false,
  type = 'text',
  value,
}) => (
  <div className={clsx('mb-5', className)}>
    <label
      aria-labelledby={name}
      htmlFor={name}
      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
    >
      {label} {required && <span>*</span>}
    </label>
    <input
      data-testid={testId}
      className={clsx('block w-full rounded-lg bg-gray-50/50 p-4 text-sm text-gray-900', classNameInput, {
        'border border-red-500': !!error,
        'border border-gray-200': !error,
      })}
      onChange={onChange}
      required={required}
      type={type}
      value={value}
    />
  </div>
);

export default Input;
