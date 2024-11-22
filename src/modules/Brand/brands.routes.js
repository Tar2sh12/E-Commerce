import { Router } from "express";
// controllers
import * as controller from "./brands.controller.js";
// middlewares
import * as Middlewares from "../../middleware/index.js";
// utils
import {
  extensions,
  generalRules,
  roles,
  systemRoles,
} from "../../utils/index.js";
import {
  createBrandSchema,
  getBrandSchema,
  updateBrandSchema,
  deleteBrandSchema,
} from "./brands.schema.js";
const brandRouter = Router();
const {
  errorHandler,
  multerHost,
  auth,
  validationMiddleware,
  authorizationMiddleware,
} = Middlewares;

brandRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(validationMiddleware(createBrandSchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.createBrand)
);

brandRouter.get(
  "/",
  errorHandler(validationMiddleware(getBrandSchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.ADMIN_BUYER)),
  errorHandler(controller.getBrands)
);

brandRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(validationMiddleware(updateBrandSchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.updatebrand)
);

brandRouter.delete(
  "/delete/:_id",
  errorHandler(validationMiddleware(deleteBrandSchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.deleteBrand)
);

brandRouter.get(
  "/brand-product",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.ADMIN_BUYER)),
  errorHandler(controller.getbrands)
);
brandRouter.get(
  "/getBrandBySubCatName",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.ADMIN_BUYER)),
  errorHandler(controller.getBrandBySubCatName)
);
export { brandRouter };
