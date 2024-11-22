import { Router } from "express";
const reviewRouter = Router();
// controllers
import * as controller from "./review.controller.js";
// utils
import {  roles, systemRoles } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";
import { reviewSchema } from "./review.schema.js";
// models

// get the required middlewares
const { errorHandler, auth, validationMiddleware, authorizationMiddleware } =
  middlewares;
reviewRouter.post(
  "/add/:productId",
  errorHandler(validationMiddleware(reviewSchema)),
  auth(),
  errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.addReview)
);
reviewRouter.get(
  "/",
  auth(),
  errorHandler(authorizationMiddleware(roles.ADMIN_BUYER)),
  errorHandler(controller.listReviews)
);
reviewRouter.put(
  "/approveOrReject/:reviewId",
  auth(),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.changeReviewStatus)
);
export { reviewRouter };
