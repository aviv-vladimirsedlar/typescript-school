import { useImperativeHandle, useState, useCallback } from 'react';

import { useMovieDelete } from '../../../common/hooks/useMovieDelete';
import { Movie } from '../../../common/types/movie.types';

import { Props } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useHook = ({ ref, refetch }: Props & { ref: any }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [movieDelete, setMovieDelete] = useState<Movie | null>(null);

  const handleSuccess = () => {
    refetch();
    toggleModal();
  };

  const mutation = useMovieDelete({ onSuccess: handleSuccess });

  const handleMovieDeleteConfirm = async () => {
    if (movieDelete) {
      setIsLoading(true);
      try {
        await mutation.mutate(movieDelete.id);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }
  };

  const handleMovieDeleteCancel = () => {
    setMovieDelete(null);
    toggleModal();
  };

  const handleOpen = useCallback((movie: Movie) => {
    setMovieDelete(movie);
    toggleModal();
  }, []);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  useImperativeHandle(ref, () => ({ open: handleOpen }), [handleOpen]);

  return { handleMovieDeleteCancel, handleMovieDeleteConfirm, isLoading, movieDelete, isOpen, toggleModal };
};
