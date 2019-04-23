import mongoose, { Model } from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import AnswerService from "./../../src/answer/answer.service";

import Answer from "./../../src/answer/answer.model";
import VoteService from "./../../src/vote/vote.service";

const answerId = new ObjectId();
const userId = new ObjectId();
const questionId = new ObjectId();

describe("Get answer for question", () => {
  beforeEach(() => {
    VoteService.getVoteTotalForAnswer = async (answerId: mongoose.Types.ObjectId) => 1;

    const answers = [
      {
        _id: answerId,
        userId: userId,
        questionId: questionId,
        text: "Some text.",
        postTime: 0
      }
    ];

    Answer.find = () => {
      return {
        lean: () => {
          return {
            exec: async () => {
              return answers;
            }
          };
        }
      };
    };
  });

  it("should return the answers with vote total.", () => {
    return expect(AnswerService.getAnswersForQuestion(questionId)).resolves.toEqual([{
      _id: answerId,
      userId: userId,
      questionId: questionId,
      text: "Some text.",
      postTime: 0,
      voteTotal: 1
    }]);
  });
});
describe("Add answer", () => {
  beforeEach(() => {
    jest.mock("./../../src/answer/answer.model.ts", () => {
      return jest.fn().mockImplementation(
        (userId: number, questionId: number, text: string): Model => {
          return {
            save: () => {
              expect(userId).toEqual(userId);
              expect(questionId).toEqual(questionId);
              expect(text).toEqual("Some Text.");
            }
          };
        }
      );
    });
  });

  it("should add a new answer.", () => {
    AnswerService.addAnswer(userId, answerId, "Some Text.");
  });
});

describe("Update answer", () => {
  beforeEach(() => {
    Answer.findOneAndUpdate = (params: any, update: any) => {
      return {
        exec: async () => {
          expect(params).toEqual({
            _id: answerId,
            userId: userId
          });
          expect(update).toEqual({
            text: "Some Text."
          });
        }
      };
    };
  });

  it("should update with the right parameters", () => {
    AnswerService.updateAnswer(userId, answerId, "Some Text.");
  });
});

describe("Delete answer", () => {
  beforeEach(() => {
    Answer.deleteOne = (params: any) => {
      return {
        exec: async () => {
          expect(params).toEqual({ _id: answerId, userId: userId });
        }
      };
    };
  });

  it("should update with the right parameters", () => {
    AnswerService.deleteAnswer(userId, answerId);
  });
});
