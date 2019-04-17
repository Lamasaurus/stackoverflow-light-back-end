import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import config from "./../config/config.json";

import { authorizationErrorHandler } from "./midleware/token.midleware";

import UserRouter from "./user/user.controller";
import QuestionController from "./question/question.controller";
import AnswerController from "./answer/answer.controller";
import VoteController from "./vote/vote.controller";

const app = express();

// Add midlewear to pars data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(authorizationErrorHandler);

app.use("/user", UserRouter);
app.use("/question", QuestionController);
app.use("/answer", AnswerController);
app.use("/vote", VoteController);

// start server
const port = config.port || 4000;
const server = app.listen(port, async () => {
  mongoose.connect(config.mongo.uri, config.mongo.options);
  console.log("Server listening on port " + port);
});
