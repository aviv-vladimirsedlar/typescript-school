import React, { useRef } from 'react';

import Button from '../../../common/components/Button';
import { useCurrentUser } from '../../../common/hooks/useCurrentUser';
import { useMovies } from '../../../common/hooks/useMovies';
import { Movie } from '../../../common/types/movie.types';
import { nameToSlug } from '../../../common/utils/string.util';
import { MovieCreateEditModal } from '../MovieCreateEditModal';
import { MovieDeleteConfirmModal } from '../MovieDeleteConfirmModal';

export const MovieList = () => {
  const movieCreateEditRef = useRef<{ open: (movie?: Movie) => void }>(null);
  const movieDeleteRef = useRef<{ open: (movie: Movie) => void }>(null);

  const { data, refetch } = useMovies();
  const { currentUser, isAdmin, isAuthor } = useCurrentUser();

  const onMovieCreate = () => {
    movieCreateEditRef?.current?.open();
  };

  const handleMovieDelete = (movie: Movie) => () => {
    movieDeleteRef?.current?.open(movie);
  };

  const handleMovieEdit = (movie: Movie) => () => {
    movieCreateEditRef?.current?.open(movie);
  };

  const renderMovie = (movie: Movie) => {
    const isAbleToEdit = isAdmin || currentUser?.id === movie.owner.id;
    const isAbleToDelete = isAdmin || currentUser?.id === movie.owner.id;
    return (
      <div
        key={movie.id}
        id={`movie-${nameToSlug(movie.title)}`}
        className="col-span-1 flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow"
      >
        <div className="relative">
          <div
            className="h-[300px] w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://placehold.co/600x400)` }}
          />
        </div>
        <div className="flex h-full flex-grow flex-col justify-between p-5">
          <div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <strong>Duration:</strong>
                <span>{movie.duration}</span>
              </div>
              <div className="flex items-center">
                <strong>Year:</strong>
                <span>{movie.year}</span>
              </div>
            </div>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.title}</h5>
            {!!movie.description && (
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {movie.description?.substring(0, 100)}...
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <Button data-testid="movie-more-btn" className="py-2">
              Read more
            </Button>
            <div className="flex gap-2">
              {isAbleToEdit && (
                <Button data-testid="movie-edit-btn" className="py-2" onClick={handleMovieEdit(movie)}>
                  Edit
                </Button>
              )}
              {isAbleToDelete && (
                <Button data-testid="movie-delete-btn" className="bg-red-500 py-2" onClick={handleMovieDelete(movie)}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start py-12">
      {isAuthor && (
        <Button data-testid="movie-create-btn" className="bg-red-500 py-2" onClick={onMovieCreate}>
          Create movie
        </Button>
      )}
      <div className="grid w-full grid-cols-1 gap-5 pt-4 sm:grid-cols-2 lg:grid-cols-3">{data?.map(renderMovie)}</div>
      <MovieCreateEditModal ref={movieCreateEditRef} refetch={refetch} />
      <MovieDeleteConfirmModal ref={movieDeleteRef} refetch={refetch} />
    </div>
  );
};
