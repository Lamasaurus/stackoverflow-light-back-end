import mongoose, { Model } from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import QuestionService from "./../../src/question/question.service";

import Question, { IQuestion } from "./../../src/question/question.model";
import VoteService from "./../../src/vote/vote.service";
import AnswerService from "./../../src/answer/answer.service";

import config from "./../../config/config.json";
import Answer from "../../src/answer/answer.model";

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

VoteService.getVoteTotalForQuestion = async (
  questionId: mongoose.Schema.Types.ObjectId
) => questionIds.indexOf(questionId);

AnswerService.getAnswersForQuestion = async (
  questionId: mongoose.Schema.Types.ObjectId
) => [{_id: ObjectId(), userId: ObjectId(), questionId: ObjectId(), text: "Some text.", postTime: 0}];

describe("Get top questions", () => {
  beforeEach(() => {
    config.numTopQuestions = 3;


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
    expect(QuestionService.getTopQuestions()).resolves.toEqual([
      {
        _id: questionIds[3],
        userId: userIds[3],
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 3,
        answerTotal: 1,
      },
      {
        _id: questionIds[2],
        userId: userIds[2],
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 2,
        answerTotal: 1,
      },
      {
        _id: questionIds[1],
        userId: userIds[1],
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 1,
        answerTotal: 1,
      },
      {
        _id: questionIds[0],
        userId: userIds[0],
        title: "A title",
        text: "Some text.",
        postTime: 1000,
        voteTotal: 0,
        answerTotal: 1,
      }
    ]);
  });
});

describe("Get question by id", () => {
  beforeEach(() => {
    Question.findById = (id: mongoose.Schema.Types.ObjectId) => {
      return {
        lean: () => {
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
          }
        }
      };
    };
  });

  it("should find one question with a vote and answer total.", () => {
    return expect(QuestionService.getQuestionById(questionIds[0])).resolves.toEqual({
      _id: questionIds[0],
      userId: userIds[0],
      title: "A title",
      text: "Some text.",
      postTime: 1000,
      voteTotal: 0,
      answerTotal: 1
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
