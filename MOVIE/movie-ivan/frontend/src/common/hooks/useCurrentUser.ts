import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import axiosInstance from '../../config/api';
import { loginSuccess } from '../../config/slices/auth.slice';

const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const dispatch = useDispatch();

  const { isLoading } = useQuery('currentUser', getCurrentUser, {
    retry: false,
    onSuccess: (res) => {
      setCurrentUser(res);
      dispatch(loginSuccess({ user: res }));
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  return { currentUser, isLoading };
};
