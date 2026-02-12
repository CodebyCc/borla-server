import { compare, hash } from "bcrypt";
import { Model, model, ObjectId, Schema } from "mongoose";

interface MobileUserDocument {
  name: string;
  email: string;
  password: string;
  telephone: string;
  verified: boolean;
  avatar?: { url: string; publicId: string };
  tokens: string[];
}
interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

const mobileUserSchema = new Schema<MobileUserDocument, {}, Methods>(
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

    telephone: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
      //   required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    tokens: [String],
  },
  { timestamps: true }
);

mobileUserSchema.pre("save", async function (next) {
  // Hash Toekn
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }

  next();
});

mobileUserSchema.methods.comparePassword = async function (password) {
  const result = await compare(password, this.password);
  return result;
};
export default model("MobileUser", mobileUserSchema) as Model<
  MobileUserDocument,
  {},
  Methods
>;
