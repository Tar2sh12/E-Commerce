import { Router } from "express";
const addressRouter = Router();
// controllers
import * as controller from "./address.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";
import {
  createAddressSchema,
  showAvailableCitiesSchema,
  showAddressSchema,
  updateAddressSchema,
  deleteAddressSchema,
} from "./address.schema.js";
// models
// import { Address } from "../../../DB/models/index.js";

// get the required middlewares
const { errorHandler, auth, validationMiddleware } = middlewares;

addressRouter.post(
  "/create",
  errorHandler(validationMiddleware(createAddressSchema)),
  errorHandler(auth()),
  errorHandler(controller.createAddress)
);
addressRouter.put(
  "/update/:_id",
  errorHandler(validationMiddleware(updateAddressSchema)),
  errorHandler(auth()),
  errorHandler(controller.updateAddress)
);
addressRouter.put(
  "/delete/:_id",
  errorHandler(validationMiddleware(deleteAddressSchema)),
  errorHandler(auth()),
  errorHandler(controller.deleteAddress)
);
addressRouter.get(
  "/",
  errorHandler(validationMiddleware(showAddressSchema)),
  errorHandler(auth()),
  errorHandler(controller.getAddresses)
);
addressRouter.get(
  "/availableCities",
  errorHandler(validationMiddleware(showAvailableCitiesSchema)),
  errorHandler(auth()),
  errorHandler(controller.availableCities)
);
export { addressRouter };



// hiii