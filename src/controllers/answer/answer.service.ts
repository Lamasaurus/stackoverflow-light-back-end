import Answer, { IAnswer } from "./answer.model";
import VoteService from "./../vote/vote.service";

import { ObjectId } from "../../helpers/mongoose.helper";

export default class AnswerService {
  /*
   * Get the vote total from the vote service and add it to the answer object.
   */
  private static async addAnswerVotes(answer: IAnswer) {
    answer.voteTotal = await VoteService.getVoteTotalForAnswer(answer._id);
  }

  /*
   * Get all the answers for a certain question.
   */
  public static async getAnswersForQuestion(
    questionId: ObjectId
  ): Promise<IAnswer[]> {
    // Find the answers to the question
    const answers = await Answer.find({ questionId }).lean().exec();

    // Add the vote total
    for (const answer of answers) await this.addAnswerVotes(answer);

    return answers;
  }

  public static addAnswer(
    userId: ObjectId,
    questionId: ObjectId,
    text: string
  ): Promise<IAnswer> {
    const newAnswer = new Answer({ userId, questionId, text });
    return newAnswer.save();
  }

  public static updateAnswer(userId: ObjectId, answerId: ObjectId, text: string): Promise<IAnswer[]> {
    return Answer.findOneAndUpdate({ _id: answerId, userId }, { text }).exec();
  }

  public static deleteAnswer(userId: ObjectId, answerId: ObjectId): Promise<IAnswer[]> {
    return Answer.deleteOne({ _id: answerId, userId }).exec();
  }

  public static findAnswerContaining(text: string): Promise<IAnswer[]> {
    return Answer.find({ text: { $regex: `.*${text}.*`}}).exec();
  }
}
