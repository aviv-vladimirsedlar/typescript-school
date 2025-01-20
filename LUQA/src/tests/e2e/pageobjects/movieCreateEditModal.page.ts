import { $ } from '@wdio/globals';

import Page from './page';

class MovieCreateEditModal extends Page {
  public async createMovie(title: string, description: string, duration: string, year: string) {
    await $('[data-testid="title-input"] input').setValue(title);
    await $('[data-testid="duration-input"] input').setValue(duration);
    await $('[data-testid="year-input"] input').setValue(year);
    await $('[data-testid="description-input"] textarea').setValue(description);

    await $('[data-testid="create-edit-movie-confirm-btn"]').click();
  }
}

export default new MovieCreateEditModal();
