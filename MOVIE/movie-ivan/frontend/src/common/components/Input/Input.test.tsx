import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import Input from '.';

describe('Input component', () => {
  it('renders the input with correct label', () => {
    render(<Input data-testid="username" label="Username" name="username" value="" onChange={() => {}} />);
    expect(screen.getByTestId(/username/i)).toBeInTheDocument();
  });

  it('renders required asterisk when required is true', () => {
    render(<Input data-testid="email" label="Email" name="email" value="" onChange={() => {}} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<Input data-testid="input" label="Email" name="email" value="" onChange={() => {}} error="Invalid email" />);
    const inputElement = screen.getByTestId('input');
    expect(inputElement).toHaveClass('border-red-500');
  });

  it('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();
    render(<Input data-testid="input" label="Password" name="password" value="" onChange={handleChange} />);
    const inputElement = screen.getByTestId('input');
    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders the correct initial value', () => {
    render(<Input data-testid="input" label="Search" name="search" value="initial value" onChange={() => {}} />);
    const inputElement = screen.getByTestId('input') as HTMLInputElement;
    expect(inputElement.value).toBe('initial value');
  });
});
