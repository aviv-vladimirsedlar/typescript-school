export interface ButtonProps {
  className?: string;
  label: string;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
}
