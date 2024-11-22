import { Router } from "express";
const productRouter = Router();

// controllers
import * as controller from "./products.controller.js";
// middlewares
import * as Middlewares from "../../middleware/index.js";
// utils
import {
  extensions,
  generalRules,
  roles,
  systemRoles,
} from "../../utils/index.js";
// models
import { Brand } from "../../../DB/models/index.js";

const {
  errorHandler,
  multerHost,
  checkIfIdsExit,
  auth,
  validationMiddleware,
  authorizationMiddleware,
} = Middlewares;
import { createProductSchema, deleteProductSchema, updateProductSchema } from "./products.schema.js";
productRouter.post(
  "/add",
  multerHost({ allowedExtensions: extensions.Images }).array("image", 5),
  errorHandler(validationMiddleware(createProductSchema)),
  errorHandler(auth()),
  checkIfIdsExit(Brand),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.addProduct)
);

productRouter.put(
  "/update/:productId",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(validationMiddleware(updateProductSchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.updateProduct)
);

productRouter.get(
  "/list",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.ADMIN_BUYER)),
  errorHandler(controller.listProducts)
);

productRouter.delete(
  "/delete/:id",
  errorHandler(validationMiddleware(deleteProductSchema)),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.deleteProduct)
);

productRouter.get(
  "/get/:productId",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(roles.ADMIN_BUYER)),
  errorHandler(controller.getProduct)
);
export { productRouter };
