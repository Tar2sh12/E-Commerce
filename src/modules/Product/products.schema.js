import Joi from "joi";
import { DiscountType, generalRules } from "../../utils/index.js";

export const createProductSchema = {
    body: Joi.object({
        //title, overview, specs, price, discountAmount, discountType, stock 
        title: Joi.string().required(),
        overview: Joi.string().required(),
        specs: Joi.string().required(),
        price: Joi.number().required(),
        discountAmount: Joi.number().required(),
        discountType: Joi.string().valid(...Object.values(DiscountType)),
        stock: Joi.number().required(),
    }),
    headers: Joi.object({
        token: Joi.string().required(),
        ...generalRules.headers,
    }),
    query: Joi.object({
        //category, subCategory, brand
        category: generalRules._id.required(),
        subCategory: generalRules._id.required(),
        brand: generalRules._id.required(),
    }),
}


// update product schema


export const updateProductSchema = {
    body: Joi.object({
        title: Joi.string().optional(),
        overview: Joi.string().optional(),
        specs: Joi.string().optional(),
        price: Joi.number().optional(),
        discountAmount: Joi.number().optional(),
        discountType: Joi.string().optional(),
        stock: Joi.number().optional(),
        public_id: Joi.string().optional(),
    }),
    headers: Joi.object({
        token: Joi.string().required(),
        ...generalRules.headers,
    }),
    params: Joi.object({
        productId: generalRules._id.required(),
    }),
}

export const deleteProductSchema = {
    headers: Joi.object({
        token: Joi.string().required(),
        ...generalRules.headers,
    }),
    params: Joi.object({
        id: generalRules._id.required(),
    }),
}