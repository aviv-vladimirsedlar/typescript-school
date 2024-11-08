/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

export interface ButtonProps {
  'data-testid'?: string;
  className?: string;
  children: ReactNode;
  onClick?: (data?: any) => void | Promise<void>;
  type?: 'button' | 'submit' | 'reset';
}
