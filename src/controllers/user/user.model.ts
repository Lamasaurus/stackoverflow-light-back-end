import mongoose, { Schema } from "mongoose";
import { ISchemaBasis } from "../../helpers/mongoose.helper";

export interface IUser extends ISchemaBasis {
  name: string;
  authHash: string;
  creationTime: number;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    authHash: { type: String, required: true },
    creationTime: { type: Date, required: false }
  },
  {
    timestamps: {
      createdAt: "creationTime"
    }
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
