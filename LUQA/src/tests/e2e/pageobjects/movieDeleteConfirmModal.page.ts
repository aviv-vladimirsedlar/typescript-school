import { $ } from '@wdio/globals';

import Page from './page';

class MovieDeleteConfirmModal extends Page {
  public async confirmDelete() {
    await $('[data-testid="movie-delete-confirm-btn"]').click();
  }
}

export default new MovieDeleteConfirmModal();
