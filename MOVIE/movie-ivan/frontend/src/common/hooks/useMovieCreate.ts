import { useMutation } from 'react-query';

import axiosInstance from '../../config/api';
import { Movie } from '../types/movie.types';

type MovieData = Pick<Movie, 'title' | 'description' | 'year' | 'duration'>;

const createMovie = async (data: { movieId: string; data: MovieData }) => {
  const response = await axiosInstance.post(`/movies/create`, data.data);
  return response.data;
};

export const useMovieCreate = () => {
  return useMutation(createMovie, {
    onError: (error) => {
      console.error('Movie create error:', error);
    },
  });
};
