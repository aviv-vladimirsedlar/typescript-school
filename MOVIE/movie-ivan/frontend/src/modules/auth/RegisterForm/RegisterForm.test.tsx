import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import { useRegister } from '../../../common/hooks/useRegister';

import { RegisterForm } from '.';

jest.mock('../../../common/hooks/useRegister');

const mockMutate = jest.fn();
const mockUseRegister = useRegister as jest.MockedFunction<typeof useRegister>;

describe('RegisterForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseRegister.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it('should match snapshot when initially rendered', () => {
    const { asFragment } = render(<RegisterForm />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the form and handle successful registration', async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => onSuccess && onSuccess());
    render(<RegisterForm />);
    await act(async () => {
      fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john.doe@example.com' } });
      fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Password123' } });
      fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'Password123' } });
      fireEvent.click(screen.getByTestId('btn-register'));
    });
    await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    expect(screen.queryByText(/An unknown error occurred/i)).not.toBeInTheDocument();
  });

  it('should show error message on failed registration', async () => {
    mockMutate.mockImplementation(
      (data, { onError }) => onError && onError({ response: { data: { message: 'Registration failed' } } }),
    );
    render(<RegisterForm />);
    await act(async () => {
      fireEvent.change(screen.getByTestId('first-name-input'), { target: { value: 'John' } });
      fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john.doe@example.com' } });
      fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Password123' } });
      fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'Password123' } });
      fireEvent.click(screen.getByTestId('btn-register'));
    });
    await waitFor(() => expect(screen.getByText(/Registration failed/i)).toBeInTheDocument());
  });

  it('should validate required fields and show validation errors', async () => {
    render(<RegisterForm />);
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-register'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('first-name-input')).toHaveClass(/border-red-/i);
      expect(screen.getByTestId('last-name-input')).toHaveClass(/border-red-/i);
      expect(screen.getByTestId('email-input')).toHaveClass(/border-red-/i);
      expect(screen.getByTestId('password-input')).toHaveClass(/border-red-/i);
      expect(screen.getByTestId('confirm-password-input')).toHaveClass(/border-red-/i);
    });
  });
});
