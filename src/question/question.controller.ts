import { Router } from "express";

import QuestionService from "./question.service";

import { jwtMiddleware } from "../midleware/token.midleware";

const QuestionRouter = Router();

QuestionRouter.get("/top", (req, res, next) => {
  const page = req.body.page;

  QuestionService.getTopQuestions(page)
    .then(questions => res.json(questions))
    .catch(err => res.send("Something went wrong!"));
});

QuestionRouter.post("/", jwtMiddleware, (req, res, next) => {
  const { title, text } = req.body;
  const { userId } = req.user;

  QuestionService.addQuestion(userId, title, text)
    .then(product => res.send("Question succesfully added!"))
    .catch(err => res.satus(500).send("Failed to add question."));
});

QuestionRouter.put("/", jwtMiddleware, (req, res, next) => {
  const { title, text, questionId } = req.body;
  const { userId } = req.user;

  QuestionService.updateQuestion(userId, questionId, title, text)
    .then(product => res.send("Question succesfully updated!"))
    .catch(err => res.satus(500).send("Failed to update question."));
});

QuestionRouter.delete("/", jwtMiddleware, (req, res, next) => {
  const { questionId } = req.body;
  const { userId } = req.user;

  QuestionService.deleteQuestion(userId, questionId)
    .then(product => res.send("Question succesfully deleted!"))
    .catch(err => res.satus(500).send("Failed to delete question."));
});

export default QuestionRouter;
