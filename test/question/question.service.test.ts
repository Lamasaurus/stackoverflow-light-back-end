import { Model } from "mongoose";

import QuestionService from "./../../src/question/question.service";

import Question, { IQuestion } from "./../../src/question/question.model";
import VoteService from "./../../src/vote/vote.service";

import config from "./../../config/config.json";

describe("Get top questions", () => {
  beforeEach(() => {
    config.numTopQuestions = 3;

    VoteService.getVoteTotalForQuestion = async (questionId: number) =>
      questionId;

    const questions: IQuestion[] = [
      {
        _id: 1,
        userId: 1,
        title: "A title",
        text: "Some text.",
        postTime: 1000
      },
      {
        _id: 2,
        userId: 2,
        title: "A title",
        text: "Some text.",
        postTime: 1000
      },
      {
        _id: 3,
        userId: 2,
        title: "A title",
        text: "Some text.",
        postTime: 1000
      },
      {
        _id: 4,
        userId: 3,
        title: "A title",
        text: "Some text.",
        postTime: 1000
      }
    ];

    Question.find = () => {
      return {
        exec: async () => {
          return questions;
        }
      };
    };
  });

  it("should give back the top questions", () => {
    QuestionService.getTopQuestions().then(topQuestions => {
      expect(topQuestions).toHaveLength(3);
      expect(topQuestions).toEqual([
        {
          _id: 4,
          userId: 3,
          title: "A title",
          text: "Some text.",
          postTime: 1000,
          voteTotal: 4
        },
        {
          _id: 3,
          userId: 2,
          title: "A title",
          text: "Some text.",
          postTime: 1000,
          voteTotal: 3
        },
        {
          _id: 2,
          userId: 2,
          title: "A title",
          text: "Some text.",
          postTime: 1000,
          voteTotal: 2
        }
      ]);
    });
  });

  it("should give back the top questions of increment 1", () => {
    QuestionService.getTopQuestions(1).then(topQuestions => {
      expect(topQuestions).toHaveLength(1);
      expect(topQuestions).toEqual([
        {
          _id: 1,
          userId: 1,
          title: "A title",
          text: "Some text.",
          postTime: 1000,
          voteTotal: 1
        }
      ]);
    });
  });
});

describe("Add Question", () => {
  beforeEach(() => {
    jest.mock("./../../src/question/question.model.ts", () => {
      return jest.fn().mockImplementation(
        (userId: number, title: string, text: string): Model => {
          return {
            save: () => {
              expect(userId).toEqual(1);
              expect(title).toEqual("A title");
              expect(text).toEqual("Some Text.");
            }
          };
        }
      );
    });
  });

  it("should add a new question with the right parameters", () => {
    QuestionService.addQuestion(1, "A title", "Some text.");
  });
});

describe("Update Question", () => {
  beforeEach(() => {
    Question.findIdAndUpdate = (id, title, text) => {
      return {
        exec: () => {
          expect(id).toEqual(1);
          expect(title).toEqual("A Title");
          expect(text).toEqual("Some Text.");
        }
      };
    };
  });

  it("should update the right question", () => {
    QuestionService.updateQuestion(1, "A Title", "Some Text.");
  });
});

describe("Delete Question", () => {
  beforeEach(() => {
    Question.deleteOne = (id) => {
      return {
        exec: () => {
          expect(id).toEqual(1);
        }
      };
    };
  });

  it("should update the right question", () => {
    QuestionService.deleteQuestion(1);
  });
});
