//create brand schema body=>name , headers=>token , query => category,subCategory

import Joi from "joi";
import { generalRules } from "../../utils/index.js";

export const createBrandSchema = {
    body: Joi.object({
        name: Joi.string().required(),
    }),
    headers: Joi.object({
        token: Joi.string().required(),
        ...generalRules.headers,
    }),
    query: Joi.object({
        category: Joi.string().required(),
        subCategory: Joi.string().required(),
    }),
}

export const getBrandSchema = {
    query: Joi.object({
      id: Joi.string().optional(),
      name: Joi.string().optional(),
      slug: Joi.string().optional(),
    }).custom((value, helpers) => {
      // Check if at least one of id, name, or slug is present
      const { id, name, slug } = value;
      if (!id && !name && !slug) {
        return helpers.message("At least one of id, name, or slug is required");
      }
      return value; // Return validated value
    }),
    headers: Joi.object({
        token: Joi.string().required(),
        ...generalRules.headers,
    }),
};

export const updateBrandSchema = {
    body: Joi.object({
      name: Joi.string().optional(),
    }),
    headers: Joi.object({
      token: Joi.string().required(),
      ...generalRules.headers,
    }),
    params: Joi.object({
      _id: generalRules._id.required(),
    }),
};

export const deleteBrandSchema = {
    headers: Joi.object({
      token: Joi.string().required(),
      ...generalRules.headers,
    }),
    params: Joi.object({
      _id: generalRules._id.required(),
    }),
};
  