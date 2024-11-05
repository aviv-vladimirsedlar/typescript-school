import clsx from 'clsx';
import React from 'react';

import { ButtonProps } from './types';

const Button: React.FC<ButtonProps> = ({ className, children, onClick, type = 'button' }) => (
  <button className={clsx('rounded-lg bg-blue-500 p-4 font-bold text-white', className)} onClick={onClick} type={type}>
    {children}
  </button>
);

export default Button;
