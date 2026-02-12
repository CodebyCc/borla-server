// import MobileUser from "#/models/MobileUser";
// import { CreateUser } from "#/types/user";
import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import { Router } from "express";
import { validate } from "#/middleware/validator";
import {
  create,
  generateForgetPasswordLink,
  grantValid,
  sendReVerificationToken,
  signIn,
  updatePassword,
  // sendReverificationToken,
  verifyEmail,
} from "#/controllers/user";

import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { ok } from "assert";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "#/utils/variables";
import { JwtPayload } from "jsonwebtoken";
import MobileUser from "#/models/MobileUser";
// (req, res, next) => {
//   const { email, name, password } = req.body;

//   if (!name.trim())
//     return res.json({
//       error: "name is missing",
//     });
//   if (name.length < 3)
//     return res.json({
//       error: "Invalid name ",
//     });

//   next();
// },

const router = Router();

// router.post(
//   "/signup",
//   validate(CreateUserSchema),

//   async (req: CreateUser, res) => {
//     const { email, password, name } = req.body;

//     CreateUserSchema.validate(email, password, name);

//     //   const user = await new MobileUser({ email, password, name });
//     //  user.save();

//     const newUser = await MobileUser.create({ email, password, name });
//     res.json({ newUser });
//   }
// );

router.post("/signup", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidation),
  isValidPassResetToken,
  grantValid
);

router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);

router.post("/sign-in", validate(SignInValidationSchema), signIn);

router.get("/is-auth", mustAuth, async (req, res) => {
  res.json({
    profile: req.user,
  });
});
export default router;
