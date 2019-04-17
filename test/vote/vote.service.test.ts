import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import rewire from 'rewire';

import VoteService from "./../../src/vote/vote.service";
import Vote, { IVoteSubjectId } from "./../../src/vote/vote.model";
import { exportAllDeclaration, identifier } from "@babel/types";

const VoteServiceRewire = rewire("./../../dist/src/vote/vote.service");
const checkNumberIds = VoteServiceRewire.__get__('VoteService.checkNumberIds');

const voteIds = [
  new ObjectId(),
  new ObjectId(),
  new ObjectId(),
  new ObjectId()
]

const userId = new ObjectId();
const questionId = new ObjectId();
const answerId = new ObjectId();

describe("Number ids", () => {
  it("Should run with one id", () => {
    expect(checkNumberIds({questionId: 1})).toBeUndefined();
    expect(checkNumberIds({answerId: 1})).toBeUndefined();
  });

  it("Should not run with two ids", () => {
    expect(() => checkNumberIds({questionId: 1, answerId: 1})).toThrow();
  });

  it("Should not run with no ids", () => {
    expect(() => checkNumberIds({})).toThrowError();
  });
});

describe("Getting votes", () => {
  beforeEach(() => {
    const questionVotes = [
      {
        _id: voteIds[0],
        userId: userId,
        value: 1,
        questionId: questionId
      },
      {
        _id: voteIds[1],
        userId: userId,
        value: 1,
        questionId: questionId
      }
    ];
    const answerVotes = [
      {
        _id: voteIds[2],
        userId: userId,
        value: 1,
        answerId: answerId
      },
      {
        _id: voteIds[3],
        userId: userId,
        value: 1,
        answerId: answerId
      }
    ];

    Vote.find = (condition ) => {
      return {
        exec: async () =>
          new Promise(() => {
            if (condition.questionId === questionId) return questionVotes;
            else if (condition.answerId === answerId) return answerVotes;
          })
      };
    };
  });

  it("should return votes for questions", () => {
    VoteService.getVotesForQuestion(questionId).then(votes => {
      expect(votes).toEqual([
        {
          _id: voteIds[0],
          userId: userId,
          value: 1,
          questionId: questionId
        },
        {
          _id: voteIds[1],
          userId: userId,
          value: 1,
          questionId: questionId
        }
      ]);
    });
  });

  it("should return votes for answers", () => {
    VoteService.getVotesForAnswer(answerId).then(votes => {
      expect(votes).toEqual([
        {
          _id: voteIds[2],
          userId: userId,
          value: 1,
          answerId: answerId
        },
        {
          _id: voteIds[3],
          userId: userId,
          value: 1,
          answerId: answerId
        }
      ]);
    });
  });
});

describe("Add vote", () => {
  beforeEach(() => {
    Vote.update = (conditions: any , update: any, options: any) => {
      return {
        exec: async () => {
          expect(update.userId).toEqual(conditions.userId);
          expect(update.value).toBeTruthy();
          expect(checkNumberIds({questionId: update.questionId, answerId: update.answerId})).toBeUndefined();
        }
      }
    }
  });

  it("should add a question", () => {
    VoteService.addQuestionVote(userId, 1, questionId);
  });

  it("should add a answer", () => {
    VoteService.addAnswerVote(userId, 1, answerId);
  });
});

describe("Get vote total", () => {
  beforeEach(() => {
    const questionVotes = [
      {
        _id: voteIds[0],
        userId: userId,
        value: 1,
        questionId: questionId
      },
      {
        _id: voteIds[1],
        userId: userId,
        value: 1,
        questionId: questionId
      }
    ];
    const answerVotes = [
      {
        _id: voteIds[2],
        userId: userId,
        value: 1,
        answerId: answerId
      },
      {
        _id: voteIds[3],
        userId: userId,
        value: -1,
        answerId: answerId
      }
    ];

    Vote.find = (condition: IVoteSubjectId) => {
      return {
        exec: async () =>
          new Promise(() => {
            if (condition.questionId === questionId) return questionVotes;
            else if (condition.answerId === answerId) return answerVotes;
          })
      };
    };
  });

  it("should get the vote total for questions", () => {
    VoteService.getVoteTotalForQuestion(questionId)
      .then(total => expect(total).toEqual(2));
  });

  it("should get the vote total for answers", () => {
    VoteService.getVoteTotalForAnswer(answerId)
      .then(total => expect(total).toEqual(0));
  });
});
