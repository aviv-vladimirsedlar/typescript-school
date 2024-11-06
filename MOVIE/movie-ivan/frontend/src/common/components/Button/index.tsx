import clsx from 'clsx';
import React from 'react';

import { ButtonProps } from './types';

const Button: React.FC<ButtonProps> = ({ id, className, children, onClick, type = 'button' }) => (
  <button
    id={id}
    className={clsx('rounded-lg bg-blue-500 p-2 px-6 font-semibold text-white', className)}
    onClick={onClick}
    type={type}
  >
    {children}
  </button>
);

export default Button;
