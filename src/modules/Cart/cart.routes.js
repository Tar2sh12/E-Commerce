import { Router } from "express";
const cartRouter = Router();
// controllers
import * as controller from "./cart.controller.js";
// utils
import { extensions, roles, systemRoles } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";
// models
// import { Address } from "../../../DB/models/index.js";
import { addToCartSchema } from "./cart.schema.js";
// get the required middlewares
const { errorHandler, auth, validationMiddleware, authorizationMiddleware } =
  middlewares;

cartRouter.post(
  "/create/:productId",
  errorHandler(validationMiddleware(addToCartSchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.addCart)
);
cartRouter.put(
  "/update/:productId",
  errorHandler(validationMiddleware(addToCartSchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.updateCart)
);
cartRouter.put(
  "/remove/:productId",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.removeCart)
);
cartRouter.get(
  "/",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.getCart)
);
export { cartRouter };
