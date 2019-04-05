import rewire from 'rewire';

import VoteService from "./../../src/vote/vote.service";
import Vote, { IVoteSubjectId } from "./../../src/vote/vote.model";
import { exportAllDeclaration } from "@babel/types";

const VoteServiceRewire = rewire("./../../dist/src/vote/vote.service");
const checkNumberIds = VoteServiceRewire.__get__('VoteService.checkNumberIds');

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
        _id: 1,
        userId: 1,
        value: 1,
        questionId: 1
      },
      {
        _id: 2,
        userId: 2,
        value: 1,
        questionId: 1
      }
    ];
    const answerVotes = [
      {
        _id: 3,
        userId: 1,
        value: 1,
        answerId: 1
      },
      {
        _id: 4,
        userId: 2,
        value: 1,
        answerId: 1
      }
    ];

    Vote.find = (condition ) => {
      return {
        exec: async () =>
          new Promise(() => {
            if (condition.questionId === 1) return questionVotes;
            else if (condition.answerId === 1) return answerVotes;
          })
      };
    };
  });

  it("should return votes for questions", () => {
    VoteService.getVotesForQuestion(1).then(votes => {
      expect(votes).toEqual([
        {
          _id: 1,
          userId: 1,
          value: 1,
          questionId: 1
        },
        {
          _id: 2,
          userId: 2,
          value: 1,
          questionId: 1
        }
      ]);
    });
  });

  it("should return votes for answers", () => {
    VoteService.getVotesForAnswer(1).then(votes => {
      expect(votes).toEqual([
        {
          _id: 1,
          userId: 1,
          value: 1,
          questionId: 1
        },
        {
          _id: 2,
          userId: 2,
          value: 1,
          questionId: 1
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
    VoteService.addQuestionVote(1, 1, 1);
  });

  it("should add a answer", () => {
    VoteService.addAnswerVote(1, 1, 1);
  });
});

describe("Get vote total", () => {
  beforeEach(() => {
    const questionVotes = [
      {
        _id: 1,
        userId: 1,
        value: 1,
        questionId: 1
      },
      {
        _id: 2,
        userId: 2,
        value: 1,
        questionId: 1
      }
    ];
    const answerVotes = [
      {
        _id: 3,
        userId: 1,
        value: 1,
        answerId: 1
      },
      {
        _id: 4,
        userId: 2,
        value: -1,
        answerId: 1
      }
    ];

    Vote.find = (condition: IVoteSubjectId) => {
      return {
        exec: async () =>
          new Promise(() => {
            if (condition.questionId === 1) return questionVotes;
            else if (condition.answerId === 1) return answerVotes;
          })
      };
    };
  });

  it("should get the vote total for questions", () => {
    VoteService.getVoteTotalForQuestion(1)
      .then(total => expect(total).toEqual(2));
  });

  it("should get the vote total for answers", () => {
    VoteService.getVoteTotalForAnswer(1)
      .then(total => expect(total).toEqual(0));
  });
});
