import mongoose, { Schema } from "mongoose";
import { ObjectId, ISchemaBasis } from "../../helpers/mongoose.helper";

export interface IAnswer extends ISchemaBasis {
  userId: ObjectId;
  questionId: ObjectId;
  text: string;
  postTime: number;
  voteTotal?: number;
}

const answerSchema = new Schema(
  {
    userId: { type: ObjectId, required: true },
    questionId: { type: ObjectId, required: true },
    text: { type: String, required: true },
    postTime: { type: Date, required: false }
  },
  {
    timestamps: {
      createdAt: "postTime"
    }
  }
);

const Answer = mongoose.model<IAnswer>("Answer", answerSchema);

export default Answer;
