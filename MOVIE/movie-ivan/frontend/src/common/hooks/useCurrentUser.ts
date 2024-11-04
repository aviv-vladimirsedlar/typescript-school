import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import axiosInstance from '../../config/api';
import { RootState } from '../../config/rootReducer';
import { loginSuccess } from '../../config/slices/auth.slice';

const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

export const useCurrentUser = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const isAdmin = useMemo(() => currentUser?.roles?.some((userRole) => userRole.role.name === 'admin'), [currentUser]);

  const { isLoading } = useQuery('currentUser', getCurrentUser, {
    retry: false,
    enabled: isAuthenticated,
    onSuccess: (res) => {
      dispatch(loginSuccess({ user: res }));
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  return { currentUser, isAdmin, isLoading };
};
