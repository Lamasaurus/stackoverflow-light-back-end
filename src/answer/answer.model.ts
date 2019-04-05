import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer extends Document {
  _id: number,
  userId: number,
  questionId: number,
  text: string,
  postTime: number,
  voteTotal?: number,
}

const answerSchema = new Schema({
    userId: { type: Number, required: true },
    questionId: { type: Number, required: true },
    text: { type: String, required: true },
    postTime: { type: Date, required: false }
}, {
    timestamps: {
      createdAt: 'postTime'
    },
});

const Answer = mongoose.model<IAnswer>("Answer", answerSchema)

export default Answer;