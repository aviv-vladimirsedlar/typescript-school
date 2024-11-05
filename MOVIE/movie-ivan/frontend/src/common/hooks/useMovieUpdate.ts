import { useMutation } from 'react-query';

import axiosInstance from '../../config/api';
import { Movie } from '../types/movie.types';

type MovieData = Pick<Movie, 'title' | 'description' | 'year' | 'duration'>;

const updateMovie = async (data: { movieId: string; data: MovieData }) => {
  const response = await axiosInstance.put(`/movies/${data.movieId}`, data.data);
  return response.data;
};

export const useMovieUpdate = () => {
  return useMutation(updateMovie, {
    onError: (error) => {
      console.error('Movie update error:', error);
    },
  });
};
