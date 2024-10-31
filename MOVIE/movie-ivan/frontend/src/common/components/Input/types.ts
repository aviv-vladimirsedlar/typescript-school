export interface InputProps {
  className?: string;
  classNameInput?: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: 'text' | 'password' | 'email' | 'number';
  value: string;
}
