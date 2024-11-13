import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import { useLogin } from '../../../common/hooks/useLogin';

import { LoginForm } from '.';

jest.mock('../../../common/hooks/useLogin');

const mockMutate = jest.fn();
const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;

describe('LoginForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it('should match snapshot when initially rendered', () => {
    const { asFragment } = render(<LoginForm />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the login form', () => {
    mockMutate.mockImplementation((data, { onSuccess }) => onSuccess && onSuccess());
    render(<LoginForm />);
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('btn-login')).toBeInTheDocument();
  });

  it('shows an error message on invalid credentials', async () => {
    mockMutate.mockImplementation(
      (data, { onError }) => onError && onError({ response: { data: { message: 'Invalid credentials' } } }),
    );
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'wrong@aviv-group.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByTestId('btn-login'));

    await waitFor(() => {
      expect(screen.getByTestId('login-error-message')).toHaveTextContent('Invalid credentials');
    });
  });

  it('does not show an error message on successful login', async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => onSuccess && onSuccess());
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'admin@aviv-group.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test@#12345' } });

    fireEvent.click(screen.getByTestId('btn-login'));

    await waitFor(() => {
      expect(screen.queryByTestId('login-error-message')).toBeNull();
    });
  });
});
