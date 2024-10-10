import { generalRules } from "../../utils/index.js";
import Joi from "joi";

export const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
export const deleteCategorySchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    _id: generalRules._id.required(),
  }),
};

// get category schema
export const getCategoriesSchema = {
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

//update category schema
export const updateCategorySchema = {
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
