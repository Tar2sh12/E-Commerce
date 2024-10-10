import * as controller from "./sub-categories.controller.js";
// middlewares
import * as Middlewares from "../../middleware/index.js";
// models
import { SubCategory } from "../../../DB/models/index.js";
// utils
import { extensions, roles, systemRoles } from "../../utils/index.js";
import { Router } from "express";
const subCategoryRouter = Router();
const {
  errorHandler,
  getDocumentByName,
  multerHost,
  auth,
  authorizationMiddleware,
  validationMiddleware,
} = Middlewares;
import {
  createSubCategorySchema,
  getSubCategoriesSchema,
  updateSubCategorySchema,
  deleteSubCategorySchema
} from "./sub-categories.schema.js";
subCategoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(SubCategory),
  errorHandler(validationMiddleware(createSubCategorySchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.createSubCategory)
);

subCategoryRouter.get(
  "/",
  errorHandler(validationMiddleware(getSubCategoriesSchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.ADMIN_BUYER)),
  errorHandler(controller.getSubCategory)
);

subCategoryRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(SubCategory),
  errorHandler(validationMiddleware(updateSubCategorySchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.updateSubCategory)
);

subCategoryRouter.delete(
  "/delete/:_id",
  errorHandler(validationMiddleware(deleteSubCategorySchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.deleteSubCategory)
);
subCategoryRouter.get(
  "/subcat-brand",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.ADMIN_BUYER)),
  errorHandler(controller.getSubCategories)
);
export { subCategoryRouter };
