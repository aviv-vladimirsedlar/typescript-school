import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';

import HomePage from '../pageobjects/home.page';
import LoginPage from '../pageobjects/login.page';

Given(/^LOGIN - I am on the login page$/, async () => {
  await LoginPage.open();
});

When(/^LOGIN - I login with (.+) and (.+)$/, async (email, password) => {
  await LoginPage.login(email, password);
});

When(/^LOGIN - Cannot login with wrong credentials (.+) and (.+)$/, async (email, password) => {
  await LoginPage.login(email, password);
});

When(/^LOGIN - I logout$/, async () => {
  await LoginPage.logout();
});

Then(/^LOGIN - I should see a error message saying "(.*)"$/, async (message) => {
  const flashAlertText = await LoginPage.errorMessage.getText();
  expect(flashAlertText.includes(message)).toBeTruthy();
});

Then(/^LOGIN - I should see a welcome message saying "(.*)"$/, async (message) => {
  const flashAlertText = await HomePage.welcomeMessage.getText();
  expect(flashAlertText.includes(message)).toBeTruthy();
});

Then(/^LOGIN - I should see the login page$/, async () => {
  // const btnText = await LoginPage.btnLogin.getText();
  const btnLoging = await LoginPage.isLoginPageVisible();
  expect(btnLoging).toBeTruthy();
  // expect(btnText.includes('Submit')).toBeTruthy();
});
