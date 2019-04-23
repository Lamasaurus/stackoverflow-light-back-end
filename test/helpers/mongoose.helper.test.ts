import mongoose from "mongoose";
import { ObjectId } from "../../src/helpers/mongoose.helper";

describe("ObjectId", () => {
  it("should be a subclass of mongoose.Types.ObjectId", () => {
    return expect(new ObjectId()).toBeInstanceOf(mongoose.Types.ObjectId);
  })
})