import { $ } from '@wdio/globals';

import Page from './page';

class HomePage extends Page {
  public get welcomeMessage() {
    return $('[data-testid="home-message"]');
  }

  public get btnLogout() {
    return $('[data-testid="logout-btn"]');
  }

  public async logout() {
    await this.btnLogout.click();
  }

  public open() {
    return super.open('/dashboard');
  }
}

export default new HomePage();
