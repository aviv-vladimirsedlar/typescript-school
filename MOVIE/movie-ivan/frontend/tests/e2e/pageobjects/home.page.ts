import { $ } from '@wdio/globals';

import Page from './page';

class HomePage extends Page {
  public get welcomeMessage() {
    return $('#home');
  }

  public open() {
    return super.open('/dashboard');
  }
}

export default new HomePage();
