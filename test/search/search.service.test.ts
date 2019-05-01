import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import SearchService from "../../src/controllers/search/search.service";
import QuestionService from "../../src/controllers/question/question.service";
import AnswerService from "../../src/controllers/answer/answer.service";

const questionIds = [new ObjectId(), new ObjectId(), new ObjectId()];

const answerIds = [new ObjectId(), new ObjectId(), new ObjectId()];

const userId = new ObjectId();

describe("SearchService", () => {
  it("should find questions and remove duplicates", () => {
    const questions = [
      {
        _id: questionIds[0],
        userId: userId,
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 3,
        answerTotal: 1,
      },
      {
        _id: questionIds[0],
        userId: userId,
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 3,
        answerTotal: 1,
      },
      {
        _id: questionIds[1],
        userId: userId,
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 1,
        answerTotal: 1,
      },
    ];

    const answers = [
      {
        _id: answerIds[0],
        userId: userId,
        questionId: questionIds[0],
        text: "Some text.",
        postTime: 0,
      },
      {
        _id: answerIds[1],
        userId: userId,
        questionId: questionIds[1],
        text: "Some text.",
        postTime: 0,
      },
      {
        _id: answerIds[3],
        userId: userId,
        questionId: questionIds[2],
        text: "Some text.",
        postTime: 0,
      },
    ];

    const answerQuestions = {
      [questionIds[0].toString()]: {
        _id: questionIds[0],
        userId: userId,
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 3,
        answerTotal: 1,
      },
      [questionIds[1].toString()]: {
        _id: questionIds[1],
        userId: userId,
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 3,
        answerTotal: 1,
      },
      [questionIds[2].toString()]: {
        _id: questionIds[2],
        userId: userId,
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 3,
        answerTotal: 1,
      },
    };

    QuestionService.findQuestionContaining = jest.fn(
      async (text: string) => questions,
    );
    QuestionService.getQuestionById = jest.fn(
      async (questionId: mongoose.Types.ObjectId) => {
        return answerQuestions[questionId.toString()];
      },
    );
    AnswerService.findAnswerContaining = jest.fn(
      async (text: string) => answers,
    );

    return expect(
      SearchService.searchQuestionContainingText("text"),
    ).resolves.toEqual([
      {
        _id: questionIds[0],
        userId: userId,
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 3,
        answerTotal: 1,
      },
      {
        _id: questionIds[1],
        userId: userId,
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 3,
        answerTotal: 1,
      },
      {
        _id: questionIds[2],
        userId: userId,
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 3,
        answerTotal: 1,
      },
    ]);
  });
});
