import clsx from 'clsx';
import React from 'react';

import { ButtonProps } from './types';

const Button: React.FC<ButtonProps> = ({ 'data-testid': testId, className, children, onClick, type = 'button' }) => (
  <button
    data-testid={testId}
    className={clsx('rounded-lg bg-blue-500 p-2 px-6 font-semibold', className, {
      'text-white': !className?.includes('text-'),
    })}
    onClick={onClick}
    type={type}
  >
    {children}
  </button>
);

export default Button;
