## Quotables

A simple express CRUD API for quotes

[![CircleCI](https://circleci.com/gh/mkiterian/quotables.svg?style=svg)](https://circleci.com/gh/mkiterian/quotables)

[![Coverage Status](https://coveralls.io/repos/github/mkiterian/quotables/badge.svg?branch=master)](https://coveralls.io/github/mkiterian/quotables?branch=master)


### Features
A User can:

- Store a quote with its author name, year
- Get quotes by ID, year, by author name, by created user’s ID
- Edit quotes that he/she created
- Get the longest word in a quote and its length
- Delete by ID, by author name and by year but only the ones created by me
- Do a full text search through quotes and get the results

### Routes

#### Register users
`/users`

#### Login users
`/users/login`

#### Logout users
`/users/logout`

#### Create a quote
`/quotes`

#### Get all quotes
`/quotes`

#### Get a specific quote
`/quotes/:id`

#### Update a quote
`/quotes/:id`

#### Delete a quote
`/quotes/:id`