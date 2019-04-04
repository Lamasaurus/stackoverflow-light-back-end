import Vote from './vote.model';

export interface IVoteSubjectId {
  questionId?: number,
  answerId?: number,
}

export interface IVote extends IVoteSubjectId {
  _id: number,
  userId: number,
  value: number,
}

export default class VoteService {

  private static checkNumberIds({questionId, answerId}: IVoteSubjectId) {
    if ((!questionId && !answerId) || (questionId && answerId))
      throw new Error("Vote Service needs exactly one id.");
  }

  /*
  * Get all votes for a certain question or answer (entity).
  */
  private static async getVotesForEntity({questionId, answerId}: IVoteSubjectId): Promise<IVote[]> {
    this.checkNumberIds({questionId, answerId});
    return await Vote.find({ questionId, answerId }).exec();
  }

  public static getVotesForQuestion(questionId: number): Promise<IVote[]> {
    return this.getVotesForEntity({ questionId });
  }

  public static getVotesForAnswer(answerId: number): Promise<IVote[]> {
    return this.getVotesForEntity({ answerId });
  }

  /*
  * Update the old vote, or create a new one.
  */
  private static addNewVote(userId: number, value: Number, {questionId, answerId}: IVoteSubjectId) {
    this.checkNumberIds({questionId, answerId});
    Vote.update({userId, questionId, answerId}, {userId, value, questionId, answerId}, {upsert: true})
      .exec();
  }

  public static addQuestionVote(userId: number, value: Number, questionId: number) {
    this.addNewVote(userId, value, {questionId});
  }

  public static addAnswerVote(userId: number, value: Number, answerId: number) {
    this.addNewVote(userId, value, {answerId});
  }

  /*
  * Get the vote total for an entity
  */
  private static async getVoteTotalForEntity({questionId, answerId}: IVoteSubjectId): Promise<number> {
    this.checkNumberIds({questionId, answerId});
    const votes = await this.getVotesForEntity({questionId, answerId});
    return votes.reduce((acc, vote): number => acc + vote.value, 0);
  }

  public static getVoteTotalForQuestion(questionId: number): Promise<number> {
    return this.getVoteTotalForEntity({questionId});
  }

  public static getVoteTotalForAnswer(answerId: number): Promise<number> {
    return this.getVoteTotalForEntity({answerId});
  }
}