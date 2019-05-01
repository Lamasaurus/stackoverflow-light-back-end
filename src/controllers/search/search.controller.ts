import { Router } from "express";
import SearchService from "./search.service";

const SearchRouter = Router();

SearchRouter.get("/question", async (req, res) => {
  const text = req.query.text;

  const questions = await SearchService.searchQuestionContainingText(text);

  res.send(questions);
});

export default SearchRouter;
