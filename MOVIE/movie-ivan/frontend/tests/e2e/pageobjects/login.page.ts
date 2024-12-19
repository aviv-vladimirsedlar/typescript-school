import { $ } from '@wdio/globals';

import Page from './page';

class LoginPage extends Page {
  public get inputEmail() {
    return $('[data-testid="email-input"] input');
  }

  public get inputPassword() {
    return $('[data-testid="password-input"] input');
  }

  public get btnLogin() {
    return $('[data-testid="btn-login"]');
  }

  public get btnLogout() {
    return $('[data-testid="btn-logout"]');
  }

  public get errorMessage() {
    return $('[data-testid="login-error-message"]');
  }

  public async isLoginPageVisible() {
    return this.btnLogin.getText();
  }

  public async login(email: string, password: string) {
    await this.inputEmail.setValue(email);
    await this.inputPassword.setValue(password);
    await this.btnLogin.click();
  }

  public async logout() {
    await this.btnLogout.click();
  }

  public open() {
    return super.open('/auth/login');
  }
}

export default new LoginPage();
