import React from 'react';

import { MainLayout } from '../../layouts/MainLayout';
import { MovieList } from '../../modules/movies/MovieList';

const Movies: React.FC = () => (
  <MainLayout>
    <MovieList />
  </MainLayout>
);

export default Movies;
