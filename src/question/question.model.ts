import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  _id: number,
  userId: number,
  title: string,
  text: string,
  postTime: number,
  voteTotal?: number,
}

const questionSchema = new Schema({
    userId: { type: Number, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    postTime: { type: Date, required: false }
}, {
    timestamps: {
      createdAt: 'postTime'
    },
});

const Question = mongoose.model<IQuestion>("Question", questionSchema)

export default Question;