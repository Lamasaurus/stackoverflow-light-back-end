import mongoose, { Schema } from "mongoose";
import { ObjectId, ISchemaBasis } from "../helpers/mongoose.helper";

export interface IVoteSubjectId {
  questionId?: ObjectId;
  answerId?: ObjectId;
}

export interface IVote extends IVoteSubjectId, ISchemaBasis {
  userId: ObjectId;
  value: number;
}

const voteSchema = new Schema(
  {
    userId: { type: ObjectId, required: true },
    questionId: { type: ObjectId, required: false },
    answerId: { type: ObjectId, required: false },
    value: { type: Number, required: true },
    voteTime: { type: Date, require: false }
  },
  {
    timestamps: {
      createdAt: "voteTime"
    }
  }
);

const Vote = mongoose.model<IVote>("Vote", voteSchema);

export default Vote;
