import { Modal } from 'flowbite';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import Button from '../../../common/components/Button';
import { useMovieDelete } from '../../../common/hooks/useMovieDelete';
import { Movie } from '../../../common/types/movie.types';

interface Props {
  refetch: () => void;
}

export const MovieDeleteConfirmModal = forwardRef(function DeleteComponent({ refetch }: Props, ref) {
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

  return (
    <div
      data-testid="movie-delete-confirm-modal"
      id="movie-delete-confirm-modal"
      ref={modalRef as React.RefObject<HTMLDivElement>}
      className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
    >
      <div className="relative max-h-full w-full max-w-md p-4">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700 md:min-w-[500px]">
          <button
            type="button"
            className="absolute end-2.5 top-3 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={handleMovieDeleteCancel}
          >
            <svg
              className="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 text-center md:p-5">
            <svg
              className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <strong>"{movieDelete?.title}"?</strong>
            </h3>
            <div className="flex justify-end gap-4">
              <Button
                data-testid="movie-delete-confirm-btn"
                className="bg-red-500 py-2"
                onClick={handleMovieDeleteConfirm}
              >
                Yes
              </Button>
              <Button data-testid="movie-delete-cancel-btn" className="py-2" onClick={handleMovieDeleteCancel}>
                No
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
