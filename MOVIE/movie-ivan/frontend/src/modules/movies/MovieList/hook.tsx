import { useRef } from 'react';

import { useMovies } from '../../../common/hooks/useMovies';
import { Movie } from '../../../common/types/movie.types';

export const useHook = () => {
  const movieCreateEditRef = useRef<{ open: (movie?: Movie) => void }>(null);
  const movieDeleteRef = useRef<{ open: (movie: Movie) => void }>(null);

  const { data, refetch } = useMovies();

  const onMovieCreate = () => {
    movieCreateEditRef?.current?.open();
  };

  const handleMovieDelete = (movie: Movie) => () => {
    movieDeleteRef?.current?.open(movie);
  };

  const handleMovieEdit = (movie: Movie) => () => {
    movieCreateEditRef?.current?.open(movie);
  };
  return {
    handleMovieDelete,
    handleMovieEdit,
    onMovieCreate,
    movieCreateEditRef,
    movieDeleteRef,
    movies: data,
    refetch,
  };
};
