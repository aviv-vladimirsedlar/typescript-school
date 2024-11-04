import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../config/api';
import { logoutSuccess } from '../../config/slices/auth.slice';

const logoutRequest = async () => {
  const response = await axiosInstance.delete('/users/logout');
  return response.data;
};

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation(logoutRequest, {
    onSuccess: () => {
      dispatch(logoutSuccess());
      setTimeout(() => {
        navigate('/auth/login');
      }, 1000);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};
