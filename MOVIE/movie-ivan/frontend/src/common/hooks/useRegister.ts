import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';

import axiosInstance from '../../config/api';
import { loginSuccess } from '../../config/slices/auth.slice';

interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const registerRequest = async (data: RegisterData) => {
  const response = await axiosInstance.post('/users/register', data);
  return response.data;
};

export const useRegister = () => {
  const dispatch = useDispatch();

  return useMutation(registerRequest, {
    onSuccess: (data) => {
      dispatch(loginSuccess({ user: data.user }));
    },
  });
};
