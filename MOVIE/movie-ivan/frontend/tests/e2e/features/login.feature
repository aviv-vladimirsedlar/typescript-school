Feature: Login

  Scenario: As a user, I cannot log into the secure area
    Given LOGIN - I am on the login page
    When LOGIN - Cannot login with wrong credentials admin@aviv-group.com and Test@#1234
    Then LOGIN - I should see a error message saying "Invalid email or password"

  Scenario: As a user, I can log into the secure area
    Given LOGIN - I am on the login page
    When LOGIN - I login with admin@aviv-group.com and Test@#12345
    Then LOGIN - I should see a welcome message saying "Welcome"
    
    When LOGIN - I logout
    Then LOGIN - I should see the login page
