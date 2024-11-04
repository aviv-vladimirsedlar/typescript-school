import { Modal } from 'flowbite';
import React, { useEffect, useRef, useState } from 'react';

import Button from '../../../common/components/Button';
import { useCurrentUser } from '../../../common/hooks/useCurrentUser';
import { useMovieDelete } from '../../../common/hooks/useMovieDelete';
import { useMovies } from '../../../common/hooks/useMovies';
import { Movie } from '../../../common/types/movie.types';

export const MovieList = () => {
  const modalRef = useRef<Modal | null>(null);
  const { currentUser, isAdmin } = useCurrentUser();
  const [movieDelete, setMovieDelete] = useState<Movie | null>(null);

  const onSuccess = () => {
    modalRef?.current?.hide();
    refetch();
  };

  const { data, refetch } = useMovies();
  const mutation = useMovieDelete({ onSuccess });

  useEffect(() => {
    const element = document.getElementById('popup-modal');
    const modal = new Modal(element, {}, {});
    modalRef.current = modal;
  }, []);

  const onMovieDelete = (movie: Movie) => () => {
    setMovieDelete(movie);
    modalRef?.current?.show();
  };

  const onMovieDeleteConfirm = async () => {
    if (movieDelete) {
      await mutation.mutate(movieDelete.id);
    }
  };

  const onMovieDeleteCancel = () => {
    setMovieDelete(null);
    modalRef?.current?.hide();
  };

  const renderModalDelete = () => {
    return (
      <div
        id="popup-modal"
        ref={modalRef as React.RefObject<HTMLDivElement>}
        className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
      >
        <div className="relative max-h-full w-full max-w-md p-4">
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute end-2.5 top-3 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={onMovieDeleteCancel}
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
                Are you sure you want to delete "{movieDelete?.title}"?
              </h3>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                onClick={onMovieDeleteConfirm}
              >
                Yes
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="ms-3 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                onClick={onMovieDeleteCancel}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMovie = (movie: Movie) => {
    const isAbleToDelete = isAdmin || currentUser?.id === movie.ownerId;
    return (
      <div key={movie.id} className="col-span-1 rounded-lg border border-gray-100 bg-white shadow">
        <div>
          <img className="rounded-t-lg opacity-70" src="https://placehold.co/600x400" alt="" />
        </div>
        <div className="p-5">
          <div>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.title}</h5>
          </div>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{movie.description?.substring(0, 100)}...</p>

          <div className="flex justify-between">
            <Button className="py-1" label="Read more" />
            {isAbleToDelete && <Button className="bg-red-500 py-1" label="Delete" onClick={onMovieDelete(movie)} />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-5 pt-12 sm:grid-cols-2 lg:grid-cols-3">{data?.map(renderMovie)}</div>
      {renderModalDelete()}
    </>
  );
};
