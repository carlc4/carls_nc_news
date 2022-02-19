# Welcome to NC News!

Welcome to the NC News Back End API by Carl Crozier.

This project builds a **RESTful API** around the Northcoders News Database.

The database contains information on users, articles, comments and topics.

The API was built using Postgres SQL and node-postgres.

You can find a live version of this API at:

And (eventually) a Front End to the API at: (link to follow)

# Requirements

You will need the following: Node v17.2 or higher, Postgres v8.7.3 or higher, dotenv v16 or higher and NPM v8.1.4 or higher.

To complete testing, you will need Jest version 27.5.1 or above, Supertest 6.2.2, jest-extended 2.0, jest-sorted v1.0.14, and pg-format v1.0.4 or better.

# Database Setup

You will also need to create two .env files in the route directory with the names of your development and test databases. These should be named .env.test and .env.development respectively.

After completing this step, create the database by typing

> npm run setup-dbs

from the terminal. To seed the data, you will then need to run

> npm run seed

# Getting Started

Clone the repo in the usual way, and ensure you run:

> npm install

From the terminal to install the dependencies. For testing purposes, you will also need Jest, Supertest and Jest-Sorted.

# End-points

Available end points are:

- GET /api/topics
- GET /api/comments

- GET /api/articles/

- GET /api/articles/:article_id

- GET /api/articles/:article_id/comments

- GET /api/users/
- PATCH /api/articles/:article_id

- POST /api/articles/:article_id/comments

- DELETE /api/comments/:comment_id

# Testing

This API was built using Test Driven Development (TDD) Methodology. Extensive testing was used in it's creation and is included in the repo. If you would like to run testing, please enter into the terminal

> npm i -D jest

> npm i -D supertest

> npm install --save-dev jest-sorted

Following installation, two testing suites are available. The bulk of the tests reside in the **app.test.js** file, you can run this by typing into the terminal

> npm t app.test.js

# And finally..

I hope you enjoy this repo, feedback is very much welcome and appreciated, you can contact me via github.
