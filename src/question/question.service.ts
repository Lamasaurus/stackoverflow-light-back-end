import { ObjectId } from "../helpers/mongoose.helper";

import Question, { IQuestion } from "./question.model";
import VoteService from "./../vote/vote.service";

import config from "./../../config/config.json";

export default class QuestionService {
  /*
   * Get the vote total from the vote service and add it to the question object
   */
  private static async addQuestionVotes(
    question: IQuestion
  ): Promise<IQuestion> {
    question.voteTotal = await VoteService.getVoteTotalForQuestion(
      question._id
    );
    return question;
  }

  /*
   * Calculate the score for a question with this metric:
   * (total votes) / (time in minutes since question got posted)
   */
  private static getQuestionScore(question: IQuestion): number {
    const currentTime = new Date().getTime();
    return question.voteTotal / (question.postTime / currentTime / 60000);
  }

  /*
   * Get One specific question.
   */
  public static async getQuestionById(
    questionId: ObjectId
  ): Promise<IQuestion> {
    const question = await Question.findById(questionId).exec();
    return this.addQuestionVotes(question);
  }

  /*
   * Get the top questions as defined in the config file.
   * @param increment: number, defines what the page
   */
  public static async getTopQuestions(
    increment: number = 0
  ): Promise<IQuestion[]> {
    const questions: IQuestion[] = await Question.find().lean().exec();

    // Add the vote total to each question
    // This has to be done in a for...of because map, reduce and sort don't accept
    // async functions.
    for (let question of questions)
      question = await this.addQuestionVotes(question);

    // Sort the questions
    const popularQuestions = await questions.sort((q1, q2) => {
      return this.getQuestionScore(q2) - this.getQuestionScore(q1);
    });

    // Return the right slice
    return popularQuestions.slice(
      increment * config.numTopQuestions,
      increment * config.numTopQuestions + config.numTopQuestions
    );
  }

  public static addQuestion(
    userId: ObjectId,
    title: string,
    text: string
  ): Promise<any> {
    const newQuestion = new Question({ userId, title, text });
    return newQuestion.save();
  }

  public static updateQuestion(
    userId: ObjectId,
    questionId: ObjectId,
    title: string,
    text: string
  ): Promise<any> {
    return Question.findOneAndUpdate(
      { _id: questionId, userId },
      { title, text }
    ).exec();
  }

  public static deleteQuestion(
    userId: ObjectId,
    questionId: ObjectId
  ): Promise<any> {
    return Question.deleteOne({ _id: questionId, userId }).exec();
  }
}
