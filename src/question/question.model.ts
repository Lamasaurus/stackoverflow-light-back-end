import mongoose, { Schema } from "mongoose";
import { ObjectId, ISchemaBasis } from "../helpers/mongoose.helper";

export interface IQuestion extends ISchemaBasis {
  userId: ObjectId;
  title: string;
  text: string;
  postTime: number;
  voteTotal?: number;
}

const questionSchema = new Schema(
  {
    userId: { type: ObjectId, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    postTime: { type: Date, required: false }
  },
  {
    timestamps: {
      createdAt: "postTime"
    }
  }
);

const Question = mongoose.model<IQuestion>("Question", questionSchema);

export default Question;
