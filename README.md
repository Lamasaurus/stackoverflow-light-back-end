# stackoverflow-light-back-end
The backend for the Stackoverflow light application

## Usage
Clone the repo, make sure that the [database](https://github.com/Lamasaurus/stackoverflow-light-database) is running, and then run:
```
./run.sh
```
This will get the [frontend](https://github.com/Lamasaurus/stackoverflow-light-front-end), `npm install` both itself and the frontend, build both and then start a docker container running the backend.

## Test
To test the backend run:
```
npm test
```
This will also show the code coverage.

## Design desicions
The application was build in Express because it offers an easy way to implement strong API's in a fast way.

Each controller resides in its own folder inside of `./src/controllers/`. A controller exists of a `model` that represents a Model of a Document in the database, a `service` which implements the business logic for the controller using the model and a `controller` which implements the API using the service. Tests are in a separate `./test` folder.

All tests came after the implementation of the component it tests except for the search controller, where I tried TTD.

In the `./src/helpers` folder we find a `mongoose.helper.ts` file that export a basic schema interface and `ObjectId` class so these are easily usable in the rest of the code base.

Authentication is checked using `JSON Web Tokens` this way we are able to pass a web token to the frontend client and have it expire after some time. In the `./src/middleware` folder we find a `toke.midleware.ts` class that implements authorization.
