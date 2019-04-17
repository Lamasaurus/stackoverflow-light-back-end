import UserService from "../../src/user/user.service";

import mongoose, { Model } from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import User from "../../src/user/user.model";

const testUserId = new ObjectId();

describe("Authenticate User", () => {
  beforeEach(() => {
    // Stub the findOne function
    User.findOne = params => {
      return {
        exec: async () => {
          if (params.name === "Superman") {
            return {
              _id: testUserId,
              userName: params.name
            };
          } else {
            return;
          }
        }
      };
    };
  });

  it("should authenticate when user and pasword are correct.", () => {
    UserService.authenticateUser("Superman", "password").then(token => {
      expect(typeof token).toEqual("string");
    });
  });

  it("should throw an error when authenticating user and pasword that are not correct.", () => {
    return expect(
      UserService.authenticateUser("UnknownUser", "password")
    ).rejects.toThrowError();
  });
});

describe("Change password", () => {
  it("should update the password.", () => {
    User.findOneByIdAndUpdate = (
      userId: mongoose.Types.ObjectId,
      params: any
    ) => {
      return {
        exec: async () => {
          expect(userId).toBeTruthy();
          expect(params.authHash).toBeTruthy();
        }
      };
    };

    UserService.changePassword(1, "password");
  });
});

describe("Register new user", () => {
  beforeEach(() => {
    User.findOne = params => {
      return {
        exec: async () => params.name !== "Superman"
      };
    };

    jest.mock("./../../src/user/user.model.ts", () => {
      return jest.fn().mockImplementation(
        (userId: mongoose.Types.ObjectId, params: any): Model => {
          return {
            save: () => {
              expect(userId).toEqual(userId);
              expect(params.authHash).toBeTruthy();
            }
          };
        }
      );
    });
  });

  it("should save a new user.", () => {
    UserService.registerUser("Superman", "password");
  });

  it("should error when the user already exists", () => {
    expect(UserService.registerUser("KnownUser", "password")).rejects.toThrowError();
  });
});
