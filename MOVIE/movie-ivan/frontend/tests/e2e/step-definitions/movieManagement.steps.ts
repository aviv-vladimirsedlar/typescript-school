import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';

import MovieCreateEditModal from '../pageobjects/movieCreateEditModal.page';
import MovieDeleteConfirmModal from '../pageobjects/movieDeleteConfirmModal.page';
import MovieListPage from '../pageobjects/movieList.page';

Given(/^MOVIE - I am on the movies page$/, async () => {
  await MovieListPage.open();
});

When(
  /^MOVIE - I create a movie with title "(.+)", description "(.+)", duration "(.+)", and year "(.+)"$/,
  async (title, description, duration, year) => {
    await MovieListPage.openCreateModal();
    await MovieCreateEditModal.createMovie(title, description, duration, year);
  },
);

Then(/^MOVIE - I should see the movie titled "(.+)" in the list$/, async (title) => {
  const movieExists = await MovieListPage.isMoviePresent(title);
  expect(movieExists).toBeTruthy();
});

When(/^MOVIE - I delete the movie titled "(.+)"$/, async (title) => {
  await MovieListPage.openDeleteModalForMovie(title);
  await MovieDeleteConfirmModal.confirmDelete();
});

Then(/^MOVIE - I should not see the movie titled "(.+)" in the list$/, async (title) => {
  const movieExists = await MovieListPage.isMoviePresent(title);
  expect(movieExists).toBeFalsy();
});
