import { IQuestion } from "../question/question.model";
import QuestionService from "../question/question.service";
import AnswerService from "../answer/answer.service";

export default class SearchService {
  public static async searchQuestionContainingText(
    text: string,
  ): Promise<IQuestion[]> {
    const questions = await QuestionService.findQuestionContaining(text);

    // Get all answers containing the text and get the questions they answer
    const answersContainingText = await AnswerService.findAnswerContaining(
      text,
    );

    const questionsFromAnswers = await Promise.all(
      answersContainingText.map(answer =>
        QuestionService.getQuestionById(answer.questionId),
      ),
    );

    // Make a dictionary of questions, this way we filter out duplicates
    // This could be done more efficiently
    const uniqueQuestions: { [id: string]: IQuestion } = {};
    [...questions, ...questionsFromAnswers].forEach(element => {
      uniqueQuestions[element._id.toString()] = element;
    });

    return Object.values(uniqueQuestions);
  }
}
