import { $ } from '@wdio/globals';

import { nameToSlug } from '../../../src/common/utils/string.util';

import Page from './page';

class MovieListPage extends Page {
  public async openCreateModal() {
    await $('[data-testid="movie-create-btn"]').click();
  }

  public async openEditModalForMovie(title: string) {
    const button = await $(`#movie-${nameToSlug(title)} [data-testid="movie-edit-btn"]`);
    button.click();
  }

  public async openDeleteModalForMovie(title: string) {
    await $(`#movie-${nameToSlug(title)} [data-testid="movie-delete-btn"]`).click();
  }

  public async isMoviePresent(title: string) {
    const movie = await $(`#movie-${nameToSlug(title)} h5`);
    const titleFound = await movie.getText();
    return titleFound;
  }

  public async isCreateButtonPresent() {
    return $('[data-testid="movie-create-btn"]');
  }

  public open() {
    return super.open('/movies');
  }
}

export default new MovieListPage();

// When MOVIE - I create a movie with title "My New Movie", description "A great movie", duration "120", and year "2023"
// Then MOVIE - I should see the movie titled "My New Movie" in the list

// When MOVIE - I update the movie "My New Movie" with new title "My Updated Movie" and year "2024"
// Then MOVIE - I should see the movie titled "My Updated Movie" in the list

// When MOVIE - I delete the movie titled "My Updated Movie"
// Then MOVIE - I should not see the movie titled "My Updated Movie" in the list

// When LOGIN - I logout
// Then LOGIN - I should see the login page
