Feature: Movie Management

  Scenario: As an author, I can manage movies
    Given LOGIN - I am on the login page
    When LOGIN - I login with ivanvukusic-ext@aviv-group.com and Test@#12345
    Then LOGIN - I should see a welcome message saying "Welcome"

    Given MOVIE - I am on the movies page
    When MOVIE - I create a movie with title "My New Movie", description "A great movie", duration "120", and year "2023"
    Then MOVIE - I should see the movie titled "My New Movie" in the list

    When MOVIE - I delete the movie titled "My New Movie"

    When LOGIN - I logout
    Then LOGIN - I should see the login page
