import { Modal } from 'flowbite';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { useMovieDelete } from '../../../common/hooks/useMovieDelete';
import { Movie } from '../../../common/types/movie.types';

import { Props } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useHook = ({ ref, refetch }: Props & { ref: any }) => {
  const modalRef = useRef<Modal | null>(null);

  const [movieDelete, setMovieDelete] = useState<Movie | null>(null);

  const handleSuccess = () => {
    modalRef?.current?.hide();
    refetch();
  };

  const mutation = useMovieDelete({ onSuccess: handleSuccess });

  const handleMovieDeleteConfirm = async () => {
    if (movieDelete) {
      await mutation.mutate(movieDelete.id);
    }
  };

  const handleMovieDeleteCancel = () => {
    setMovieDelete(null);
    modalRef?.current?.hide();
  };

  const handleOpen = (movie: Movie) => {
    setMovieDelete(movie);
    modalRef?.current?.show();
  };

  useEffect(() => {
    const element = document.getElementById('movie-delete-confirm-modal');
    const modal = new Modal(element, {}, {});
    modalRef.current = modal;
  }, []);

  useImperativeHandle(ref, () => ({ open: handleOpen }), []);

  return { handleMovieDeleteCancel, handleMovieDeleteConfirm, modalRef, movieDelete };
};
