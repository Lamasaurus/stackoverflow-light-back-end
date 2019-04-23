import { ObjectId } from "../../helpers/mongoose.helper";

import Vote, { IVoteSubjectId, IVote } from "./vote.model";

export default class VoteService {
  /*
   * Check if there is exactly one id provided.
   */
  private static checkNumberIds({ questionId, answerId }: IVoteSubjectId) {
    if ((!questionId && !answerId) || (questionId && answerId))
      throw new Error("Vote Service needs exactly one id.");
  }

  /*
   * Get all votes for a certain question or answer (entity).
   */
  private static async getVotesForEntity({
    questionId,
    answerId
  }: IVoteSubjectId): Promise<IVote[]> {
    this.checkNumberIds({ questionId, answerId });
    return await Vote.find({ questionId, answerId }).exec();
  }

  public static getVotesForQuestion(questionId: ObjectId): Promise<IVote[]> {
    return this.getVotesForEntity({ questionId });
  }

  public static getVotesForAnswer(answerId: ObjectId): Promise<IVote[]> {
    return this.getVotesForEntity({ answerId });
  }

  /*
   * Update the old vote, or create a new one.
   */
  private static addNewVote(
    userId: ObjectId,
    value: Number,
    { questionId, answerId }: IVoteSubjectId
  ): Promise<any> {
    this.checkNumberIds({ questionId, answerId });

    if (value != -1 && value != 1) throw new Error("Vote value not suported.");

    return Vote.update(
      { userId, questionId, answerId },
      { userId, value, questionId, answerId },
      { upsert: true }
    ).exec();
  }

  public static addQuestionVote(
    userId: ObjectId,
    value: Number,
    questionId: ObjectId
  ): Promise<any> {
    return this.addNewVote(userId, value, { questionId });
  }

  public static addAnswerVote(
    userId: ObjectId,
    value: Number,
    answerId: ObjectId
  ): Promise<any> {
    return this.addNewVote(userId, value, { answerId });
  }

  /*
   * Get the vote total for an entity
   */
  private static async getVoteTotalForEntity({
    questionId,
    answerId
  }: IVoteSubjectId): Promise<number> {
    this.checkNumberIds({ questionId, answerId });
    const votes = await this.getVotesForEntity({ questionId, answerId });
    return votes.reduce((acc, vote): number => acc + vote.value, 0);
  }

  public static getVoteTotalForQuestion(questionId: ObjectId): Promise<number> {
    return this.getVoteTotalForEntity({ questionId });
  }

  public static getVoteTotalForAnswer(answerId: ObjectId): Promise<number> {
    return this.getVoteTotalForEntity({ answerId });
  }

  /*
  * Get the vote a user made for a certain entity
  */
  private static getVoteByUserForEntity(userId: ObjectId, {
    questionId,
    answerId
  }: IVoteSubjectId): Promise<IVote> {
    this.checkNumberIds({ questionId, answerId });
    return Vote.findOne({userId, questionId, answerId}).exec();
  }

  public static getVoteByUserForQuestion(userId: ObjectId, questionId: ObjectId): Promise<IVote> {
    return this.getVoteByUserForEntity(userId, { questionId });
  }

  public static getVoteByUserForAnswer(userId: ObjectId, answerId: ObjectId): Promise<IVote> {
    return this.getVoteByUserForEntity(userId, { answerId });
  }
}
