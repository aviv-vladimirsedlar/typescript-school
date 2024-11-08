export interface InputProps {
  'data-testid'?: string;
  className?: string;
  classNameInput?: string;
  error?: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: 'text' | 'password' | 'email' | 'number';
  value: string;
}
