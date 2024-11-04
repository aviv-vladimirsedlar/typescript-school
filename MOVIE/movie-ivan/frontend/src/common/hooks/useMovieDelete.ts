import { useMutation } from 'react-query';

import axiosInstance from '../../config/api';

const deleteMovie = async (movieId: string) => {
  const response = await axiosInstance.delete(`/movies/${movieId}`);
  return response.data;
};

export const useMovieDelete = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation(deleteMovie, {
    onSuccess,
    onError: (error) => {
      console.error('Delete error:', error);
    },
  });
};
