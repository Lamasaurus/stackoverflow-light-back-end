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
   * Get all the questions.
   */
  private static async getAllQuestions(): Promise<IQuestion[]> {
    return await Question.find().exec();
  }

  /*
   * Get the top NUMBER_OF_TOP_QUESTION questions.
   * @param increment: number, defines what the page
   */
  public static async getTopQuestions(
    increment: number = 0
  ): Promise<IQuestion[]> {
    const questions: IQuestion[] = await this.getAllQuestions();

    // Add the vote total to each question
    // This has to be done in a for...of because map, reduce and sort don't accept
    // async functions.
    for (let question of questions) {
      question = await this.addQuestionVotes(question);
    }

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

  public static addQuestion(userId: number, title: string, text: string) {
    const newQuestion = new Question({userId, title, text});
    newQuestion.save();
  }

  public static updateQuestion(
    questionId: number,
    title: string,
    text: string
  ) {
    Question.findByIdAndUpdate(questionId, { title, text }).exec();
  }

  public static deleteQuestion(questionId: number) {
    Question.deleteOne({ _id: questionId }).exec();
  }
}
