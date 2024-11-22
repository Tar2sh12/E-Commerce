// "country": "EG",
// "city": "Giza",
// "postalCode": 123456,
// "buildingNumber": 10,
// "floorNumber": 1,
// "addressLabel": "work",
// "setAsDefault": true

import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";
export const createAddressSchema = {
  body: Joi.object({
    country: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.number().required(),
    buildingNumber: Joi.number().required(),
    floorNumber: Joi.number().required(),
    addressLabel: Joi.string().required(),
    setAsDefault: Joi.boolean().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

export const showAvailableCitiesSchema = {
  body: Joi.object({
    country: Joi.string().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

export const showAddressSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

export const updateAddressSchema = {
    body: Joi.object({
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        postalCode: Joi.number().optional(),
        buildingNumber: Joi.number().optional(),
        floorNumber: Joi.number().optional(),
        addressLabel: Joi.string().optional(),
        setAsDefault: Joi.boolean().optional(),
      }),
  params: Joi.object({
    _id: generalRules._id.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

export const deleteAddressSchema = {
  params: Joi.object({
    _id: generalRules._id.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
