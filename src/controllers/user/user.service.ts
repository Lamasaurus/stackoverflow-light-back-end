import User, { IUser } from "./user.model";

import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";

import config from "./../../../config/config.json";
import { ObjectId } from "../../helpers/mongoose.helper";

export default class UserService {
  /*
   * Hash a string using sha256
   */
  private static hashString(stringToHash: string): String {
    return crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");
  }

  /*
  * Create a token for the user with the users name and id
  */
  private static createToken(userId: ObjectId, userName: string): String {
    return jsonwebtoken.sign(
      { userId, userName },
      config.authentication.secret,
      config.authentication.options
    );
  }

  /*
   * Check if a user exists with the given credentials and return a token for
   * this user.
   */
  public static async authenticateUser(
    userName: string,
    password: string
  ): Promise<ITokenResponse> {
    // Hash the incoming password
    const hashedPassword = this.hashString(password);

    // Look for a user with the given user name and password
    const user: IUser = await User.findOne({
      name: userName,
      authHash: hashedPassword
    }).exec();

    // Check if a user was found
    if (!user)
      throw new Error("User name and password combination does not exist!");

    // Create and return the token
    const token = this.createToken(user._id, userName);
    return { token, userId: user._id };
  }

  public static changePassword(userId: number, newPassword: string) {
    const newPasswordHash = this.hashString(newPassword);
    User.findOneByIdAndUpdate(userId, { authHash: newPasswordHash}).exec();
  }

  public static async registerUser(userName: string, password: string) {
    const user = await User.findOne({ name: userName }).exec();

    if (user)
      throw new Error("User already exists!");

    const newUser = new User({name: userName, authHash: this.hashString(password)});
    newUser.save();
  }
}

export interface ITokenResponse {
  token: String;
  userId: ObjectId;
}
