import { Router } from "express";

import VoteService from "./vote.service";

import { jwtMiddleware } from "../../midleware/token.midleware";

const VoteRouter = Router();

VoteRouter.post("/question/", jwtMiddleware, (req, res, next) => {
  const { questionId, value } = req.body;
  const userId = req.user.userId;

  VoteService.addQuestionVote(userId, value, questionId)
    .then(product => res.send("Vote succesfully added!"))
    .catch(err => res.send("Something went wrong!"));
});

VoteRouter.get("/question/", jwtMiddleware, (req, res, next) => {
  const questionId = req.query.questionId;
  const userId = req.user.userId;

  VoteService.getVoteByUserForQuestion(userId, questionId)
    .then(vote => res.json(vote))
    .catch(err => res.send("Vote was not found."));
});

VoteRouter.get("/question/total", jwtMiddleware, (req, res, next) => {
  const questionId = req.query.questionId;

  VoteService.getVoteTotalForQuestion(questionId)
    .then(total => res.json(total))
    .catch(err => res.send("Vote was not found."));
});

VoteRouter.post("/answer/", jwtMiddleware, (req, res, next) => {
  const { answerId, value } = req.body;
  const userId = req.user.userId;

  VoteService.addAnswerVote(userId, value, answerId)
    .then(product => res.send("Vote succesfully added!"))
    .catch(err => res.send("Something went wrong!"));
});

VoteRouter.get("/answer/", jwtMiddleware, (req, res, next) => {
  const answerId = req.query.answerId;
  const userId = req.user.userId;

  VoteService.getVoteByUserForAnswer(userId, answerId)
    .then(vote => res.json(vote))
    .catch(err => res.send("Vote was not found."));
});

VoteRouter.get("/answer/total", jwtMiddleware, (req, res, next) => {
  const answerId = req.query.answerId;

  VoteService.getVoteTotalForAnswer(answerId)
    .then(total => res.json(total))
    .catch(err => res.send("Vote was not found."));
});

export default VoteRouter;