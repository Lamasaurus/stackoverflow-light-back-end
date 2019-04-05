import Answer, { IAnswer } from "./answer.model";
import VoteService from "./../vote/vote.service";

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
    questionId: number
  ): Promise<IAnswer[]> {
    // Find the answers to the question
    const answers = await Answer.find({ questionId }).exec();

    // Add the vote total
    for (const answer of answers) await this.addAnswerVotes(answer);

    return answers;
  }

  public static addAnswer(userId: number, questionId: number, text: string) {
    const newAnswer = new Answer({ userId, questionId, text });
    newAnswer.save();
  }

  public static updateAnswer(answerId: number, text: string) {
    Answer.findByIdAndUpdate(answerId, { text }).exec();
  }

  public static deleteAnswer(answerId: number) {
    Answer.deleteOne({ _id: answerId }).exec();
  }
}
