import { Box } from '@gemini/core';
import { Button, Card, ImageSlider } from '@gemini/ui';
import React from 'react';

import { useCurrentUser } from '../../../common/hooks/useCurrentUser';
import { Movie } from '../../../common/types/movie.types';
import { nameToSlug } from '../../../common/utils/string.util';
import { MovieCreateEditModal } from '../MovieCreateEditModal';
import { MovieDeleteConfirmModal } from '../MovieDeleteConfirmModal';

import { useHook } from './hook';

export const MovieList = () => {
  const { currentUser, isAdmin, isAuthor } = useCurrentUser();
  const { handleMovieDelete, handleMovieEdit, movieCreateEditRef, movieDeleteRef, movies: data, refetch } = useHook();

  const renderMovie = (movie: Movie) => {
    const isAbleToEdit = isAdmin || currentUser?.id === movie.owner.id;
    const isAbleToDelete = isAdmin || currentUser?.id === movie.owner.id;
    return (
      <Box key={movie.id}>
        <Card testId={`movie-${nameToSlug(movie.title)}`} borderRadius="4">
          <ImageSlider
            accessibilityLabel="ImageSlider Card Story"
            images={[
              {
                alt: 'image 4',
                id: '057ad265-e74a-4571-b817-2805b254a285',
                url: `https://picsum.photos/1000/1000/?image=212`,
              },
            ]}
            ratio="3/2"
          />
          <Box marginTop="spacing.8">
            <Box display="flex" gap="spacing.12">
              <Box display="flex" gap="spacing.2" typography="typography.body.16.regular">
                <Box typography="typography.body.16.bold">Duration:</Box>
                <Box>{movie.duration}</Box>
              </Box>
              <Box display="flex" gap="spacing.2" typography="typography.body.16.regular">
                <Box typography="typography.body.16.bold">Year:</Box>
                <Box>{movie.year}</Box>
              </Box>
            </Box>
            <Box as="h3" typography="typography.headline.20.bold" marginVertical="spacing.2">
              {movie.title}
            </Box>
            {!!movie.description && (
              <Box as="p">
                {movie.description?.substring(0, 100)}
                {movie?.description?.length > 100 ? '...' : ''}
              </Box>
            )}
          </Box>

          <Box display="flex" justifyContent="flex-end" marginTop="spacing.8">
            <Box display="flex" gap="spacing.4">
              {isAbleToEdit && (
                <Button testId="movie-edit-btn" onPress={handleMovieEdit(movie)} size="40" variant="primary">
                  Edit
                </Button>
              )}
              {isAbleToDelete && (
                <Button testId="movie-delete-btn" onPress={handleMovieDelete(movie)} size="40" variant="danger">
                  Delete
                </Button>
              )}
            </Box>
          </Box>
        </Card>
      </Box>
    );
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start" paddingVertical="spacing.36">
      {!!data.length && (
        <Box
          display="grid"
          marginTop="spacing.24"
          gap="spacing.16"
          width="100%"
          gridTemplateColumns={{
            'breakpoint.sm': 'repeat(1, 1fr)',
            'breakpoint.md': 'repeat(2, minmax(0, 1fr))',
            'breakpoint.lg': 'repeat(3, minmax(0, 1fr))',
            'breakpoint.xl': 'repeat(4, minmax(0, 1fr))',
          }}
        >
          {data?.map(renderMovie)}
        </Box>
      )}
      {!!isAuthor && <MovieCreateEditModal ref={movieCreateEditRef} refetch={refetch} />}
      <MovieDeleteConfirmModal ref={movieDeleteRef} refetch={refetch} />
    </Box>
  );
};
