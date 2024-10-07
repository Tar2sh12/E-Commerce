//import joi
import Joi from "joi";
import { GenderTypes, systemRoles } from "../../utils/index.js";
import { generalRules } from "../../utils/general-rules.utils.js";
export const createUserSchema = {
  body: Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    userType: Joi.string().valid(...Object.values(systemRoles)),
    gender: Joi.string().valid(...Object.values(GenderTypes)),
    phone: Joi.string().required(),
    age: Joi.number().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.number().required(),
    buildingNumber: Joi.number().required(),
    floorNumber: Joi.number().required(),
    addressLabel: Joi.string().required(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const getInfoSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

export const deleteUserSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

export const updateInfoSchema = {
  body: Joi.object({
    userName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    userType: Joi.string()
      .valid(...Object.values(systemRoles))
      .optional(),
    gender: Joi.string()
      .valid(...Object.values(GenderTypes))
      .optional(),
    phone: Joi.string().optional(),
    age: Joi.number().optional(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().required(),
  }),
};


export const changePasswordSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    otp: Joi.string().required(),
  }),
}

