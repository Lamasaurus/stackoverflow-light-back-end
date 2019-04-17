import mongoose, { Model } from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import QuestionService from "./../../src/question/question.service";

import Question, { IQuestion } from "./../../src/question/question.model";
import VoteService from "./../../src/vote/vote.service";

import config from "./../../config/config.json";

const questionIds = [
  new ObjectId(),
  new ObjectId(),
  new ObjectId(),
  new ObjectId()
];

const userIds = [
  new ObjectId(),
  new ObjectId(),
  new ObjectId(),
  new ObjectId()
];

describe("Get top questions", () => {
  beforeEach(() => {
    config.numTopQuestions = 3;

    VoteService.getVoteTotalForQuestion = async (
      questionId: mongoose.Schema.Types.ObjectId
    ) => questionIds.indexOf(questionId);

    const questions: IQuestion[] = [
      {
        _id: questionIds[0],
        userId: userIds[0],
        title: "A title",
        text: "Some text.",
        postTime: 1000
      },
      {
        _id: questionIds[1],
        userId: userIds[1],
        title: "A title",
        text: "Some text.",
        postTime: 1000
      },
      {
        _id: questionIds[2],
        userId: userIds[2],
        title: "A title",
        text: "Some text.",
        postTime: 1000
      },
      {
        _id: questionIds[3],
        userId: userIds[3],
        title: "A title",
        text: "Some text.",
        postTime: 1000
      }
    ];

    Question.find = () => {
      return {
        lean: () => {
          return {
            exec: async () => {
              return questions;
            }
          };
        }
      };
    };
  });

  it("should give back the top questions", () => {
    QuestionService.getTopQuestions().then(topQuestions => {
      expect(topQuestions).toHaveLength(3);
      expect(topQuestions).toEqual([
        {
          _id: questionIds[3],
          userId: userIds[3],
          title: "A title",
          text: "Some text.",
          postTime: 1000,
          voteTotal: 3
        },
        {
          _id: questionIds[2],
          userId: userIds[2],
          title: "A title",
          text: "Some text.",
          postTime: 1000,
          voteTotal: 2
        },
        {
          _id: questionIds[1],
          userId: userIds[1],
          title: "A title",
          text: "Some text.",
          postTime: 1000,
          voteTotal: 1
        }
      ]);
    });
  });

  it("should give back the top questions of increment 1", () => {
    QuestionService.getTopQuestions(1).then(topQuestions => {
      expect(topQuestions).toHaveLength(1);
      expect(topQuestions).toEqual([
        {
          _id: questionIds[0],
          userId: userIds[0],
          title: "A title",
          text: "Some text.",
          postTime: 1000,
          voteTotal: 0
        }
      ]);
    });
  });
});

describe("Get question by id", () => {
  beforeEach(() => {
    Question.findById = (id: mongoose.Schema.Types.ObjectId) => {
      return {
        exec: async () => {
          return {
            _id: questionIds[0],
            userId: userIds[0],
            title: "A title",
            text: "Some text.",
            postTime: 1000
          };
        }
      };
    };
  });

  it("should find one question with a vote total.", () => {
    QuestionService.getQuestionById(userIds[0]).then(question => {
      return expect(question).toEqual({
        _id: questionIds[0],
        userId: userIds[0],
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 0
      });
    });
  });
});

describe("Add Question", () => {
  beforeEach(() => {
    jest.mock("./../../src/question/question.model.ts", () => {
      return jest.fn().mockImplementation(
        (
          userId: mongoose.Schema.Types.ObjectId,
          title: string,
          text: string
        ): Model => {
          return {
            save: () => {
              expect(userId).toEqual(userId[0]);
              expect(title).toEqual("A title");
              expect(text).toEqual("Some Text.");
            }
          };
        }
      );
    });
  });

  it("should add a new question with the right parameters", () => {
    QuestionService.addQuestion(userIds[0], "A title", "Some text.");
  });
});

describe("Update Question", () => {
  beforeEach(() => {
    Question.findOneAndUpdate = (params, { title, text }) => {
      return {
        exec: async () => {
          expect(params).toEqual({
            _id: questionIds[0],
            userId: userIds[0]
          });
          expect(title).toEqual("A Title");
          expect(text).toEqual("Some Text.");
        }
      };
    };
  });

  it("should update the right question", () => {
    QuestionService.updateQuestion(
      userIds[0],
      questionIds[0],
      "A Title",
      "Some Text."
    );
  });
});

describe("Delete Question", () => {
  beforeEach(() => {
    Question.deleteOne = conditions => {
      return {
        exec: async () => {
          expect(conditions).toEqual({
            _id: questionIds[0],
            userId: userIds[0]
          });
        }
      };
    };
  });

  it("should update the right question", () => {
    QuestionService.deleteQuestion(userIds[0], questionIds[0]);
  });
});
