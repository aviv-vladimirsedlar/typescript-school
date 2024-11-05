/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ButtonProps {
  className?: string;
  label: string;
  onClick?: (data?: any) => void | Promise<void>;
  type?: 'button' | 'submit' | 'reset';
}
