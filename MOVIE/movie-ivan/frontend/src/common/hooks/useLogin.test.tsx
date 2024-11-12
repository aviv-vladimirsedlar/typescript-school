import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loginSuccess } from '../../config/slices/auth.slice';

import { useLogin } from './useLogin';

// Mock axios directly in the test file
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      response: {
        use: jest.fn((onFulfilled, onRejected) => {
          onFulfilled({ data: {} });
          onRejected({ response: { status: 401, data: { message: 'Unauthorized' } } });
        }),
      },
    },
    post: jest.fn(),
  })),
}));

// Mock other dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../../config/slices/auth.slice', () => ({
  loginSuccess: jest.fn(),
  logoutSuccess: jest.fn(),
}));

describe('useLogin', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it('calls dispatch and navigate on successful login', async () => {
    const mockUserData = {
      user: { id: '1', name: 'Test User', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
    };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: mockUserData });

    const { result, waitFor } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      result.current.mutate({ email: 'test@example.com', password: 'password123' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDispatch).toHaveBeenCalledWith(loginSuccess({ user: mockUserData.user }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles login failure correctly', async () => {
    const errorMessage = 'Invalid credentials';
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result, waitFor } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      result.current.mutate({ email: 'wrong@example.com', password: 'wrongpassword' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
