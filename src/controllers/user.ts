import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

import MobileUser from "#/models/MobileUser";
import { CreateUser, VerifyEmailRequest } from "#/types/user";
import { generateToken } from "#/utils/helper";
import {
  sendForgetPasswordLink,
  sendPasswordResetSuccessEmail,
  sendVerificationMail,
} from "#/utils/mail";
import { Verify } from "crypto";
import EmailVerificationToken from "#/models/emailVerificationToken";
import emailVerificationToken from "#/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";
import passwordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import { error } from "console";
import User from "#/models/User";

// Controller for signing users up
export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name, telephone } = req.body;

  const user = await MobileUser.create({ name, email, password, telephone });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  // Looking to send emails in production? Check out our Email API/SMTP product!

  res.status(201).json({ user: { id: user._id, name, email, telephone } });
};

// Get A single User
export const getUser = async (req: Request, res: Response) => {
  try {
    // const name = req.params.name;
    const id = req.params.packagename;
    const user = await MobileUser.findById({ id });
    // console.log(product, product.length);
    // if (!user || user.length === 0) {
    //   return res.status(404).json({ message: "Package not found" });
    // }

    return res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;
  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({
      error: "Invalid token!!!",
    });
  const matched = await verificationToken.compareToken(token);

  if (!matched)
    return res.status(403).json({
      error: "Invalid token!!!",
    });

  await MobileUser.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({
    message: "Your email is verified",
  });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  // Check if objectid is valid
  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid Request!" });

  // Check if user is exist
  const user = await MobileUser.findById(userId);

  if (!user) return res.status(403).json({ error: "Invalid Request!!" });

  // Delete old token if one already exist to avoid interruptions
  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  // Generate Token
  const token = generateToken();

  // Create new user token
  await emailVerificationToken.create({
    owner: userId,
    token,
  });

  // Send email to the user
  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({
    message: "Please check your mail",
  });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  // use email to send link
  const { email } = req.body;

  // Find User
  const user = await MobileUser.findOne({ email });

  // If No User Return
  if (!user) return res.status(404).json({ error: "Account not found!" });

  // generate the link
  // https://yourapp.com/reset-password?token=hfkshf4322hfjkds&userId=67jhfdsahf43

  await passwordResetToken.findOneAndDelete({
    owner: user._id,
  });

  // Generate Random token
  const token = crypto.randomBytes(36).toString("hex");

  // Create Token with user
  await passwordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check your mail to change password" });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await MobileUser.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access" });
  const matched = await user.comparePassword(password);

  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be different" });

  user.password = password;

  await user.save();
  passwordResetToken.findOneAndDelete({ owner: user.id });

  // Send suucess Email
  // Accepts name and email
  sendPasswordResetSuccessEmail(user.name, user.email);

  res.json({ message: "Password Reset Successfully" });
};

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await MobileUser.findOne({
    email,
  });

  if (!user)
    return res.status(403).json({
      error: "Email/Password mismatch",
    });

  // compare Password
  const matched = await user.comparePassword(password);

  if (!matched)
    return res.status(403).json({
      error: "Email/Password mismatch",
    });

  // Generate the token for later use.

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  // Update token in users db
  user.tokens.push(token);

  // save token
  user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      telephone: user.telephone,
    },
    token,
  });
};
