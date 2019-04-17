import { Router } from "express";

import VoteService from "./vote.service";

import { jwtMiddleware } from "../midleware/token.midleware";

const VoteRouter = Router();

VoteRouter.post("/question/", jwtMiddleware, (req, res, next) => {
  const { questionId, value } = req.body;
  const userId = req.user.userId;

  VoteService.addQuestionVote(userId, value, questionId)
    .then(product => res.send("Vote succesfully added!"))
    .catch(err => res.send("Something went wrong!"));
});

VoteRouter.post("/answer/", jwtMiddleware, (req, res, next) => {
  const { answerId, value } = req.body;
  const userId = req.user.userId;

  VoteService.addAnswerVote(userId, value, answerId)
    .then(product => res.send("Vote succesfully added!"))
    .catch(err => res.send("Something went wrong!"));
});

export default VoteRouter;