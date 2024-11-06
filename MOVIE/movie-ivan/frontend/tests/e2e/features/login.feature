Feature: Login

  Scenario: As a user, I cannot log into the secure area
    Given I am on the login page
    When Cannot login with wrong credentials admin@aviv-group.com and Test@#1234
    Then I should see a error message saying "Invalid email or password"

  Scenario: As a user, I can log into the secure area
    Given I am on the login page
    When I login with admin@aviv-group.com and Test@#12345
    Then I should see a welcome message saying "Welcome"
