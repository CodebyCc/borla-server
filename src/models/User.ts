import { Model, model, ObjectId, Schema } from "mongoose";

interface UserDocument {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: { url: string; publicId: string };
  tokens: string[];
  favorites: ObjectId[];
  followings: ObjectId;
  followers: ObjectId;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        types: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
    followers: [
      {
        types: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        types: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tokens: [String],
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema) as Model<UserDocument>;
