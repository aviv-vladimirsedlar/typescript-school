import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';

import HomePage from '../pageobjects/home.page';
import LoginPage from '../pageobjects/login.page';

Given(/^I am on the login page$/, async () => {
  await LoginPage.open();
});

When(/^I login with (.+) and (.+)$/, async (email, password) => {
  await LoginPage.login(email, password);
});

When(/^Cannot login with wrong credentials (.+) and (.+)$/, async (email, password) => {
  await LoginPage.login(email, password);
});

Then(/^I should see a error message saying "(.*)"$/, async (message) => {
  const flashAlertText = await LoginPage.errorMessage.getText();
  expect(flashAlertText.includes(message)).toBeTruthy();
});

Then(/^I should see a welcome message saying "(.*)"$/, async (message) => {
  const flashAlertText = await HomePage.welcomeMessage.getText();
  expect(flashAlertText.includes(message)).toBeTruthy();
});
