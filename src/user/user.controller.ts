import { Router } from "express";

import UserService from "./user.service";

const UserRouter = Router();

UserRouter.post("/register", (req, res, next) => {
  const { userName, password } = req.body;
  UserService.registerUser(userName, password)
    .then(() => res.status(201).send("User Created!"))
    .catch(error => next(error));
});

UserRouter.post("/authenticate", (req, res, next) => {
  const { userName, password } = req.body;
  UserService.authenticateUser(userName, password)
    .then(token => res.json(token))
    .catch(error => next(error));
});

export default UserRouter;
