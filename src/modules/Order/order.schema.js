import Joi from "joi";
import { generalRules, paymentMethods } from "../../utils/index.js";

export const createOrderSchema = {
  body: Joi.object().keys({
    paymentMethod: Joi.string().valid(...Object.values(paymentMethods)).required(),
    address: Joi.string().required(),
    addressId: generalRules._id.required(),
    contactNumber: Joi.string().required(),
    shipingFee: Joi.number().required(),
    VAT: Joi.number().required(),
    couponCode: Joi.string().optional(),
  }),
}

// cancelOrderSchema
export const cancelOrderSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    orderId: generalRules._id.required(),
  }),
}

export const deliveredOrderSchema = {
    headers: Joi.object({
      token: Joi.string().required(),
      ...generalRules.headers,
    }),
    params: Joi.object({
      orderId: generalRules._id.required(),
    }),
  }