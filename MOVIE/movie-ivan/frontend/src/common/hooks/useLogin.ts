import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';

import axiosInstance from '../../config/api';
import { loginSuccess } from '../../config/slices/auth.slice';

interface LoginData {
  email: string;
  password: string;
}

const loginRequest = async (data: LoginData) => {
  const response = await axiosInstance.post('/users/login', data);
  return response.data;
};

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation(loginRequest, {
    onSuccess: (data) => {
      dispatch(loginSuccess({ user: data.user }));
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};
