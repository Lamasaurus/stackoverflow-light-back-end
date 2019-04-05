import { Model } from "mongoose";

import AnswerService from "./../../src/answer/answer.service";

import Answer from "./../../src/answer/answer.model";
import VoteService from "./../../src/vote/vote.service";

describe("Get answer for question", () => {
  beforeEach(() => {
    VoteService.getVoteTotalForQuestion = async (answerId: number) => answerId;

    const answers = [
      {
        _id: 1,
        userId: 1,
        questionId: 1,
        text: "Some text.",
        postTime: 0
      }
    ];

    Answer.find = () => {
      return {
        exec: async () => {
          return answers;
        }
      };
    };
  });

  it("should return the answers with vote total.", () => {
    AnswerService.getAnswersForQuestion(1).then(answer => {
      expect(answer).toEqual({
        _id: 1,
        userId: 1,
        questionId: 1,
        text: "Some text.",
        postTime: 0,
        voteTotal: 1
      });
    });
  });
});

describe("Add answer", () => {
  beforeEach(() => {
    jest.mock("./../../src/answer/answer.model.ts", () => {
      return jest.fn().mockImplementation(
        (userId: number, questionId: number, text: string): Model => {
          return {
            save: () => {
              expect(userId).toEqual(1);
              expect(questionId).toEqual(1);
              expect(text).toEqual("Some Text.");
            }
          };
        }
      );
    });
  });

  it("should add a new answer.", () => {
    AnswerService.addAnswer(1, 1, "Some Text.");
  });
});

describe("Update answer", () => {
  beforeEach(() => {
    Answer.findByIdAndUpdate = (id: number, update: any) => {
      return {
        exec: async () => {
          expect(id).toEqual(1);
          expect(update).toEqual({
            text: "Some Text."
          });
        }
      };
    };
  });

  it("should update with the right parameters", () => {
    AnswerService.updateAnswer(1, "Some Text.");
  });
});

describe("Delete answer", () => {
  beforeEach(() => {
    Answer.deleteOne = (id: number) => {
      return {
        exec: async () => {
          expect(id).toEqual({ _id: 1 });
        }
      };
    };
  });

  it("should update with the right parameters", () => {
    AnswerService.deleteAnswer(1);
  });
});
