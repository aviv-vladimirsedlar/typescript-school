import clsx from 'clsx';
import React from 'react';

import { InputProps } from './types';

const Input: React.FC<InputProps> = ({
  className,
  classNameInput,
  label,
  name,
  onChange,
  required = false,
  type = 'text',
  value,
}) => (
  <div className={clsx('mb-5', className)}>
    <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
      {label}
    </label>
    <input
      id={name}
      className={clsx(
        'block w-full rounded-lg border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-900',
        classNameInput,
      )}
      onChange={onChange}
      required={required}
      type={type}
      value={value}
    />
  </div>
);

export default Input;
