# REST API Crud

#### Basic Backend using Express, Prisma ORM, TypeScript and Postgres database.

---

## Start the project

- After cloning this repository run `npm i` from the root folder.
- Create postgres db, push the schema and seeds with `npm run seed`.
- Start the local server with `npm run dev`.

## Project initialization

- Install the latest Node LTS version (if you haven't already).
- Create an empty postgres database with the name `rest-api-crud`.
- Create the folder for the project and initialize npm with `npm init -y`.
- Add the git remote to the GithHub repository for the project.
- Install `express` dependency (node framework).
- Install devDependencies: `prisma`, `typescript`, `ts-node`, `@types/node` and `@types/express`.
  - Prisma: the ORM (Object-relational mapping).
  - TS-Node: TypeScript execution engine and REPL for Node.js.
  - @Types/Node and @Types-Express: TypeScript types definitions.
- Create `tsconfig.json` file with default configurations:
  ```
  {
  "compilerOptions": {
    "target": "ESNext",
    "moduleResolution": "Node",
    "outDir": "dist",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "5.0",
    "forceConsistentCasingInFileNames": true,
    "noPropertyAccessFromIndexSignature": false
    }
  }
  ```
- Add scripts for:
  - Development: `"dev": "node --watch src/index.ts"`.
  - Production: `"build": "npx tsc"`. This script creates a transpiled JavaScript build in the folder `/dist`.
  - To execute production build: `"start": "node dist/index.ts"`.
- Initialize Prisma using `npx prisma init --datasource-provider postgresql`. This creates `/prisma` folder with the schema configured for Postgres and `.env` file for environment variables.
- Add postgres user, password and database name in `DATABASE_URL` inside `.env` file.

## Watch Mode

Watch mode prevents the server from stopping after changes in the code.
The native Node flag `--watch` replaces the dependency `nodemon`.
By default, watch mode cleans the terminal after changes. To maintain the logs add a second flag `--watch-preserve-output`.

## Enviroment Variables

Since v20.6 Node can load environment variables natively.
The env files are `.env.development` for development and `.env.production` for production.
An additional `.env` file contains shared variables to both environments.
To combine the variables in the dev script: `node --env-file=.env.development --env-file=.env (...rest of the script)`.
And in the production script: `node --env-file=.env.development --env-file=.env (...rest of the script)`.

## Database Schema

This is the original ERD schema for an online bookstore database.

![databaseSchema](images/bookStore_schema.png)

A new ERD using `draw.io` with some changes in relations and data types was created taking advantage of some unique postgres features.

![newDatabaseSchema](images/rest-api-crud.drawio.png)

For example, all the string values are `TEXT` fields (postgres recommends against char or varchar with param because it uses more db space), for money values `MONEY` field and dates `TMESTAMPTZ`.

To delete an item with relations (e.g., Books can have many Reviews) the relation params for the model need to include `onDelete: Cascade`.
Following the Books example, if a book is deleted all the related reviews will also be deleted.

## Database creation

Create an empty postgres db with the name `rest_api_crud`.
In macOS use **Postgress.app** to create and execute postgres db's and **Postico** for tables visualization and editing as an alternative to pgcli.

Migrate the models to the db with the script `npx prisma migrate dev --name init`.
This creates a new folder `/prisma/migrations` with a migration file with the name used at the end of the script (in this case "init").
If not previously installed, the script will install `prisma-client-js` generator to connect to the db.

> The script for production and testing migrations is `npx prisma migrate deploy`. But is only recommended for automated CI/CD pipelines.

## Seeds

Mockaroo (https://www.mockaroo.com/) is a tool to create fake data for db seeding in different formats (json, object, CSV, etc).
The mocks used are objects (not json) to avoid the conversion process.
The files are located in `/prisma/seedData` named `seed.ts`.

> Because the dates have an incorrect format I'm mapping the arrays to replace them to ISO format.

To avoid relation conflicts between model seeds, the function executes `Promise.all` applying "upsert" for every object.
This solves the issue of duplicate data and allows the seeds to be applied multiple times without errors.

> The `Promise.all` for seeding the models in the `runSeeders()` function must respect this order:
>
> 1. Models without relations declaration.
> 2. Models with relations to previous models.
>
> This happens because the seed stores false Ids. And if the second model tries to make a relation to a non-existent Id it will return an error.

The script `npm run seed` finds or creates the db and populates the db with the seeds executing "prisma db push" (forces db schema) combined with `prisma/seed.ts`.

## Linter and Formatter

`Biome` is used for linting and formatting.
The configurations and use are very similar to ESLint and Prettier all in one dependency. And the execution is much faster.
The file `biome.json` stores all the configurations for linting and formatting.

## Routes

The routes for the models are located in `/api/routes`.
The file `index.ts` combines all the routes import for simpler export to the server.

## Error handling

The middleware `globalErrorHandler` prevents repetition and gives consistency in error handling.
The class `CustomError` extends the default Error adding status and message values.
The middleware uses the class to receive the errors.
The controllers use the function `errorHandler` passing the params status and message. The function creates a new error extended by `CustomError`.
The wild card middleware that catches all the non-existing routes pass the errors to `globalErrorHandler` with status 400.

The middleware `notFoundHandler` catches all the incorrect routes and returns status `404` with the received route and error message. The error is passed to `globalErrorHandler`.

## Send book cover image files

The endpoint `/api/image/:id` returns book cover images in jpg format using the id for the book.
It also includes error handling for the `res.sendFile` method when the Id is incorrect or the book cover doesn't exist.

## Pagination and Sorting

The pagination uses Offset pagination that requires two values: `take` (number of items per page) and `skip` (the number of items to offset on the list).
The skip value is the page number multiplied by the page number. The result must be an integer using `Math.floor`.
OrderBy receives the sort (column name) and type of order (`asc` or `desc`).

## Categories list

The `category` endpoints return lists of models and categories (models column names).
The lists are intended to be used by the client side for dropdowns or filter options.
For example, to filter books by `author`, `title`, etc.
Because the columns for the tables can change over time, the lists will always allow the frontend to use faithful and up-to-date data.

## Params Validation

The data received in the endpoints by query and body is validated using `express-validator`.
The dependency works as a middleware before the controllers for the routes.
The configuration files are stored in `/api/validators` with the same names as the controllers.

## Filtering

Prisma uses a `where` object to apply the filters.
The filter works in conjunction with pagination and sorting (orderBy).
Some of the filters are optional and only passed to the `where` object if the query param exist.
Because the amount of elements using `where` are different from the unfiltered list, the controllers pass the "where" object to `count` and `findMany`.

## Orders and OrderDetails

The OrderDetails (specifies the book, quantity and price per item) are always related to an Order.
Because of this relation, only by creating a new Order the OrderDetails are added.

## Cors

The dependency `cors` (along with `@types/cors` as devDependency) enables cors to communicate with a frontend running with a different port.
The file `api/config/corsOptions.ts` specifies the allowed origins to interact with the api.
Without an options file as parameter, cors will be enabled for all origins.

## Logger

The project uses `morgan` (and `@types/morgan` as devDependency) http logger in "dev" mode (reduced details) for development and "common" for production (more details).

## Redis

The project uses Redis for memory data storage allowing faster responses.
To start the redis server (after installing Redis locally) run `redis-server` on the terminal.
The app DBngin is an alternative for executing redis locally.
The redis server can be stopped using `ctrl-c` or `redis-cli shutdown`.
The redis singleton client `/config/redisClient` logs by console the conection status.
For monitor and manipulate the keys stored in Redis use `Redis Insight`.
The dependency `ioredis` is used to interact with Redis from Node.
The Redis uses are:

### Cache

Redis is used as cache for lists controllers to improve speed and prevevents overloads in the db.
The endpoints using redis returns a value `cache` (boolean).

> This value is not necessary, but useful to identify the responses from db or cache.

If the controller finds a cache key for the specific request will return the cached values.
If no chache is found the controller calls the db, stores in cache the result and then returns them.
The aditional params "EX" (for seconds, or "PX" for milliseconds) and the number of seconds adds expiration to the cached keys.
When the cache expires it removes itself from redis.
The services to create, modify and delete elements removes all the existing cached keys for the related lists.

### User session

See [JWT Access and Refresh](#jwt-access-and-refresh)

### Rate Limiter

See [Rate Limiter](#rate-limiter)

## Password hash and salt

New users passwords are encrypted using `bcrypt` hash and salt.
Bcrypt hashes the password and adds salt to avoid rainbow table attacks.
The password is stored in db hashed and is only known by the user.
If the user forgets or needs to change the password a new password must be entered.
Bcrypt verify the passwords at login by encrypting and comparing the recieved and stored password (the hash and salt must be equal).
The hashed password never gets decrypted by Bcrypt.

# Rate Limiter

The middleware `rateLimiter.middleware.ts` prevents from brute force attacks in the `/customer/login` endpoint storing the user Ip and the user email in Redis with the number of failed attemps and the TTL (time to live) for the Redis key.
If the user exceeds the amount of failed requests permitted, the middleware returns status 429 (Too many requests) and changes de TTL for the Redis key to the block duration specified in the env variable blocking the user access.

A second rate limiter middleware `rateLimiterFlexible.middleware.ts` using `rate-limiter-flexible` can be found in the project.
It also stores in Redis with the same results as `rateLimiter.middleware.ts`.
The only difference is the `insuranceLimiter` configuration allowing to continue processing requests in memory if Redis fails.
This middleware is not used in the project but is kept as a possible backup and for configuration reference.

## JWT Access and Refresh

When the user successfully login, the server returns two JWT (Jason Web Token) in http only cookies: `access_token` and `refresh_token`.
This allows for stateless user sessions and permissions (client side).
The cookies prevent the JWT from being javascript accessible from the client side.
Only the signatures for the jwt and the cookies are encrypted, not the tokens content.

- The `access_token` informs the server if the user have access to the resources. The token and the cookie are short-lived to prevent signature forgery and other types of attacks.
  When the token gets invalidated or the cookie expires, if the `refresh_token` is valid, a new `access_token` is generated.
- The `refresh_token` validation is longer and gives the user session on the client side.
  As long the `refresh_token` is valid, a new `access_token` is generated allowing the user to access the permitted resources.

## Export to CSV

To export a table to CSV file use the SQL query in `/scripts/exportToCSV.sql` replacing the table name, path and name for the `.csv` file.

## Swagger documentation

The list of endpoints is documented with Swagger in `http://localhost:8080/docs`.
The endpoints are ordered by types and include params, query params and body.
All the responses show status code and examples.

## Testing

The routes (E2E) and controllers (unit-testing) are tested using `jest` and `supertest`.
Additionally the devDependencies `@types/jest`, `@types/supertest` and `ts-jest` are required to work with TypeScript.
`ioredis-mock` is used to mock Redis in testing enviroment.

The devDependencies for testing are `jest`, `ts-jest`, `@types/jest`, `supertest` and `@types/supertest`.
To initialize jest in the project run the command `npx ts-jest config:init`. This will create a file `jest.config.js`.
The script `npm test` in package.json executes the tests named `*.test.ts` and/or the files located in `/__tests__` folders.

## ToDo

- Testing (complete controllers / full routes) - Investigate Vitest
- Github actions (biome and tests)

docker compose config

Docker - Conditional RUN executions
