import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import axiosInstance from '../../config/api';
import { updateUserList } from '../../config/slices/user.slice';
import { RootState } from '../../config/store';

const getUsers = async () => {
  const response = await axiosInstance.get('/users?limit=100');
  return response.data;
};

export const useUsers = () => {
  const userData = useSelector((state: RootState) => {
    return state.user;
  });

  const dispatch = useDispatch();

  const { isLoading, refetch } = useQuery('getUsers', getUsers, {
    retry: false,
    onSuccess: (data) => {
      dispatch(updateUserList(data));
    },
    onError: (error) => {
      console.error('User list error:', error);
    },
  });

  return { data: userData.data, meta: userData.meta, isLoading, refetch };
};
