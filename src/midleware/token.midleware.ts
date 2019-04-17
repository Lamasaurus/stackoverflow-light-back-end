import expressJwt from "express-jwt";

import config from "./../../config/config.json";

export const jwtMiddleware = expressJwt({
  secret: config.authentication.secret
});

export function authorizationErrorHandler(err, req, res, next) {
  if (err.constructor.name === "UnauthorizedError") {
    res.status(401).send("invalid token!");
  }
}
