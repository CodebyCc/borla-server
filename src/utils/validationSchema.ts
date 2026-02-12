import * as yup from "yup";
import { isValidObjectId } from "mongoose";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing")
    .min(3, "Name is too short")
    .max(20, "Name is too long"),

  email: yup.string().required("email is required").email("Invalid email id"),

  password: yup
    .string()
    .trim()
    .required("Password is missing")
    .min(8, "Password is too short")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{8,})/,
      "Password is not strong"
    ),
});

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid Token!!"),

  userId: yup
    .string()
    .trim()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      } else {
        return "";
      }
    })
    .required("Invalid userId"),
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid Token!!"),

  userId: yup
    .string()
    .trim()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      } else {
        return "";
      }
    })
    .required("Invalid userId"),

  password: yup
    .string()
    .trim()
    .required("Password is missing")
    .min(8, "Password is too short")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{8,})/,
      "Password is not strong"
    ),
});

export const SignInValidationSchema = yup.object().shape({
  email: yup.string().required("Email is missing").email("Invalid email id"),
  password: yup.string().trim().required("Password is missing"),
});
