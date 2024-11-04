import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import axiosInstance from '../../config/api';
import { RootState } from '../../config/rootReducer';
import { updateMovieList } from '../../config/slices/movie.slice';

const getMovies = async () => {
  const response = await axiosInstance.get('/movies');
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
