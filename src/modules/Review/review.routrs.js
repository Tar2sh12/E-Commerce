import { Router } from "express";
const reviewRouter = Router();
// controllers
import * as controller from "./review.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";
// models

// get the required middlewares
const { errorHandler, auth , validationMiddleware} = middlewares;
reviewRouter.post("/add/:productId", auth(), errorHandler(controller.addReview));
reviewRouter.get('/', auth(), errorHandler(controller.listReviews));
reviewRouter.put('/approveOrReject/:reviewId', auth(), errorHandler(controller.changeReviewStatus));
export { reviewRouter };