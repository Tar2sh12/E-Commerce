import Joi from "joi";
import { generalRules } from "../../utils/index.js";

export const addToCartSchema = {
  body: Joi.object({
    quantity: Joi.number().required(),
  }),
  params: Joi.object({
    productId: generalRules._id.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

export const removeFromCartSchema = {
  params: Joi.object({
    productId: generalRules._id.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

export const getCartSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
