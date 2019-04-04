import mongoose, { Schema } from 'mongoose';

const voteSchema = new Schema({
    _id: { type: Number, required: true },
    userId: { type: Number, required: true },
    questionId: { type: Number, required: false },
    answerId: { type: Number, required: false },
    value: { type: Number, required: true },
    voteTime: { type: Date, require: true }
}, {
    timestamps: {
      createdAt: 'voteTime'
    },
});

const Vote = mongoose.model("Vote", voteSchema)

export default Vote;