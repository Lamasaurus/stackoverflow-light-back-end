import { Router } from "express";

import AnswerService from "./answer.service";

import { jwtMiddleware } from "../../midleware/token.midleware";

const AnswerRouter = Router();

AnswerRouter.get("/", (req, res, next) => {
  const questionId = req.query.questionId;

  AnswerService.getAnswersForQuestion(questionId)
    .then(answers => res.json(answers))
});

AnswerRouter.post("/", jwtMiddleware, (req, res, next) => {
  const { questionId, text } = req.body;
  const { userId } = req.user;

  AnswerService.addAnswer(userId, questionId, text)
    .then(product => res.send("Answer succesfully added!"))
    .catch(err => res.send("Failed to add answer."));
});

AnswerRouter.put("/", jwtMiddleware, (req, res, next) => {
  const { text, answerId } = req.body;
  const { userId } = req.user;

  AnswerService.updateAnswer(userId, answerId, text)
    .then(product => res.send("Answer succesfully updated!"))
    .catch(err => res.send("Failed to update answer."));
});

AnswerRouter.delete("/", jwtMiddleware, (req, res, next) => {
  const { answerId } = req.body;
  const { userId } = req.user;

  AnswerService.deleteAnswer(userId, answerId)
    .then(product => res.send("Answer succesfully deleted!"))
    .catch(err => res.send("Failed to delete answer."));
});

export default AnswerRouter;

