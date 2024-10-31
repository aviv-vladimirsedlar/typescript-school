import React from 'react';

interface ButtonProps {
  onClick: () => void;
  label: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label }) => (
  <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
    {label}
  </button>
);

export default Button;
