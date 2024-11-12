import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';

import { LoginForm } from '.';

jest.mock('../../../common/hooks/useLogin', () => ({
  useLogin: () => ({
    mutate: jest.fn((data, { onError, onSuccess }) => {
      if (data.email === 'admin@aviv-group.com' && data.password === 'Test@#12345') {
        onSuccess();
      } else {
        onError({ response: { data: { message: 'Invalid credentials' } } });
      }
    }),
    isLoading: false,
  }),
}));

describe('LoginForm', () => {
  it('renders the login form', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('btn-login')).toBeInTheDocument();
  });

  it('shows an error message on invalid credentials', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'wrong@aviv-group.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByTestId('btn-login'));

    await waitFor(() => {
      expect(screen.getByTestId('login-error-message')).toHaveTextContent('Invalid credentials');
    });
  });

  it('does not show an error message on successful login', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'admin@aviv-group.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test@#12345' } });

    fireEvent.click(screen.getByTestId('btn-login'));

    await waitFor(() => {
      expect(screen.queryByTestId('login-error-message')).toBeNull();
    });
  });
});
