import { $ } from '@wdio/globals';

import Page from './page';

class MovieCreateEditModal extends Page {
  public async createMovie(title: string, description: string, duration: string, year: string) {
    await $('[data-testid="title-input"]').setValue(title);
    await $('[data-testid="description-input"]').setValue(description);
    await $('[data-testid="duration-input"]').setValue(duration);
    await $('[data-testid="year-input"]').setValue(year);

    await $('[data-testid="create-edit-movie-confirm-btn"]').click();
  }
}

export default new MovieCreateEditModal();
