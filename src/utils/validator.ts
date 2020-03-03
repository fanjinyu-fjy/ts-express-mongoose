import validator from "validator";
import { IUserDocument } from "src/models/User";

export interface LoginInputError extends Partial<IUserDocument> {
  general?: string;
}
export interface RegisterInputError extends Partial<IUserDocument> {
  confirmPassword?: string;
}

export const validateLoginInput = (
  username: IUserDocument["username"],
  password: IUserDocument["password"]
) => {
  let errors: LoginInputError = {};
  if (validator.isEmpty(username.trim())) {
    errors.username = "Username must not be empty";
  }
  if (validator.isEmpty(password)) {
    errors.password = "Password must not be empty";
  }
  return { errors, valid: Object.keys(errors).length < 1 };
};

export const validateRegisterInput = (
  _username: IUserDocument["username"],
  password: IUserDocument["password"],
  confirmPassword: IUserDocument["password"],
  email: IUserDocument["email"]
) => {
  let errors: RegisterInputError = {};
  // if (validator.isEmpty(username)) {
  //   errors.username = "Username must not be empty";
  // }
  if (validator.isEmpty(password)) {
    errors.password = "Password must not be empty";
  }
  if (validator.isEmpty(confirmPassword)) {
    errors.confirmPassword = "confirmPassword must not be empty";
  }
  if (!validator.equals(password, confirmPassword)) {
    errors.confirmPassword = "password not equal confirmPassword";
  }
  if (validator.isEmpty(email.trim())) {
    errors.email = "Email must not be empty";
  }

  // if (!validator.isEmail(email)) {
  //   errors.email = "Email must be a valid email address";
  // }

  return { errors, valid: Object.keys(errors).length < 1 };
};
