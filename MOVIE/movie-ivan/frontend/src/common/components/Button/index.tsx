import clsx from 'clsx';
import React from 'react';

import { ButtonProps } from './types';

const Button: React.FC<ButtonProps> = ({ className, label, onClick, type = 'button' }) => (
  <button className={clsx('rounded-lg bg-blue-500 p-4 text-white', className)} onClick={onClick} type={type}>
    {label}
  </button>
);

export default Button;
