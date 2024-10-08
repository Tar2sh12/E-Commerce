import { Router } from "express";
const categoryRouter = Router();
// controllers
import * as controller from "./categories.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";
// models
import { Category } from "../../../DB/models/index.js";
//schemas 
import { deleteCategorySchema ,createCategorySchema,getCategoriesSchema ,updateCategorySchema} from "./categories.schema.js";
// get the required middlewares
const {
  errorHandler,
  getDocumentByName,
  multerHost,
  auth,
  validationMiddleware,
  authorizationMiddleware,
} = middlewares;
// roles
import { roles, systemRoles } from "../../utils/index.js";
// routes
categoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(validationMiddleware(createCategorySchema)),
  getDocumentByName(Category),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.createCategory)
);
categoryRouter.get("/", 
  errorHandler(validationMiddleware(getCategoriesSchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.ADMIN_BUYER)),
  errorHandler(controller.getCategory));

categoryRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(validationMiddleware(updateCategorySchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  getDocumentByName(Category),
  errorHandler(controller.updateCategory)
);


categoryRouter.delete(
  "/delete/:_id",
  errorHandler(validationMiddleware(deleteCategorySchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.deleteCategory)
);

categoryRouter.get(
  "/cat-subcat",
  errorHandler(authorizationMiddleware(roles.ADMIN_BUYER)),
  errorHandler(controller.allCategoriesWithSubcatgories)
);
export { categoryRouter };
