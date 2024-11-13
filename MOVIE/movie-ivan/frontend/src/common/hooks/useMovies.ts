import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import axiosInstance from '../../config/api';
import { updateMovieList } from '../../config/slices/movie.slice';
import { RootState } from '../../config/store';

const getMovies = async () => {
  const response = await axiosInstance.get('/movies?limit=100');
  return response.data;
};

export const useMovies = () => {
  const moviesData = useSelector((state: RootState) => {
    return state.movie;
  });

  const dispatch = useDispatch();

  const { isLoading, refetch } = useQuery('getMovies?limit=100', getMovies, {
    retry: false,
    onSuccess: (data) => {
      dispatch(updateMovieList(data));
    },
    onError: (error) => {
      console.error('Movie list error:', error);
    },
  });

  return { data: moviesData.data, meta: moviesData.meta, isLoading, refetch };
};
