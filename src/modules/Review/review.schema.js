// token -> headers
// const { productId } => req.params;
// const { reviewRating, reviewComment } => req.body;
// review schema

import Joi from "joi";
import { generalRules, ReviewStatus } from "../../utils/index.js";

export const reviewSchema={
    body:Joi.object({
        reviewRating:Joi.number().required(),
        reviewComment:Joi.string().required()
    }),
    params:Joi.object({
        productId:Joi.string().required()
    }),
    headers: Joi.object({
      token: Joi.string().required(),
      ...generalRules.headers,
    }),
}

/**

    const { reviewId } = req.params;
    const { status } = req.body;
 */

export const aproveOrRejectReviewSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    reviewId: generalRules._id.required(),
  }),
  body: Joi.object({
    status: Joi.string().valid(...Object.values([ReviewStatus.Approved,ReviewStatus.Rejected])).required(),
  }),
}