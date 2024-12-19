import { $ } from '@wdio/globals';

import { nameToSlug } from '../../../src/common/utils/string.util';

import Page from './page';

class MovieListPage extends Page {
  public async openCreateModal() {
    await $('[data-testid="movie-create-edit-modal-trigger"]').click();
  }

  public async openEditModalForMovie(title: string) {
    const button = await $(`#movie-${nameToSlug(title)} [data-testid="movie-edit-btn"]`);
    button.click();
  }

  public async openDeleteModalForMovie(title: string) {
    await $(`[data-testid="movie-${nameToSlug(title)}"] [data-testid="movie-delete-btn"]`).click();
  }

  public async isMoviePresent(title: string) {
    const movie = await $(`[data-testid="movie-${nameToSlug(title)}"] h3`);
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
