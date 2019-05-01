import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import config from "./../config/config.json";

import { authorizationErrorHandler } from "./midleware/token.midleware";

import UserController from "./controllers/user/user.controller";
import QuestionController from "./controllers/question/question.controller";
import AnswerController from "./controllers/answer/answer.controller";
import VoteController from "./controllers/vote/vote.controller";
import SearchController from "./controllers/search/search.controller";

const app = express();

// Allow CORS
app.use(cors());

// Add midlewear to pars data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(authorizationErrorHandler);

app.use("/api/user", UserController);
app.use("/api/question", QuestionController);
app.use("/api/answer", AnswerController);
app.use("/api/vote", VoteController);
app.use("/api/search", SearchController);

// start server
const port = config.port || 4000;
const server = app.listen(port, async () => {
  mongoose.connect(config.mongo.uri, config.mongo.options);
  console.log("Server listening on port " + port);
});
