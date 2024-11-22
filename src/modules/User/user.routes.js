import * as controller from "./user.controller.js";
// middlewares
import * as Middlewares from "../../middleware/index.js";
// utils
import { extensions } from "../../utils/index.js";
import { Router } from "express";
import {
  createUserSchema,
  getInfoSchema,
  updateInfoSchema,
  deleteUserSchema,
  forgetPasswordSchema,
  changePasswordSchema,
  loginSchema,
} from "./user.schema.js";
const UserRouter = Router();
const { errorHandler, auth, validationMiddleware } = Middlewares;

UserRouter.post(
  "/signup",
  errorHandler(validationMiddleware(createUserSchema)),
  errorHandler(controller.signUp)
);

UserRouter.get(
  "/confirmation/:confirmationToken",
  errorHandler(controller.verifyEmail)
);
UserRouter.get(
  "/getInfo",
  errorHandler(validationMiddleware(getInfoSchema)),
  errorHandler(auth()),
  errorHandler(controller.getInfo)
);
UserRouter.post(
  "/login",
  errorHandler(validationMiddleware(loginSchema)),
  errorHandler(controller.login)
);

UserRouter.post(
  "/forgetPass",
  errorHandler(validationMiddleware(forgetPasswordSchema)),
  errorHandler(controller.forgetPassword)
);
UserRouter.patch(
  "/changePass",
  errorHandler(validationMiddleware(changePasswordSchema)),
  errorHandler(controller.changePassword)
);

UserRouter.put(
  "/update",
  errorHandler(validationMiddleware(updateInfoSchema)),
  errorHandler(auth()),
  errorHandler(controller.updateUser)
);
UserRouter.patch(
  "/delete",
  errorHandler(validationMiddleware(deleteUserSchema)),
  errorHandler(auth()),
  errorHandler(controller.deleteUser)
);
export { UserRouter };
