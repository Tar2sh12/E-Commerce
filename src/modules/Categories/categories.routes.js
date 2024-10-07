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

// get the required middlewares
const { errorHandler, getDocumentByName, multerHost ,auth} = middlewares;


// routes
categoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(Category),
  errorHandler(auth())
  ,
  errorHandler(controller.createCategory)
);
categoryRouter.get("/", errorHandler(controller.getCategory));

categoryRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(Category),
  errorHandler(controller.updateCategory)
);
categoryRouter.delete("/delete/:_id", errorHandler(controller.deleteCategory));

categoryRouter.get("/cat-subcat", errorHandler(controller.allCategoriesWithSubcatgories));
export {categoryRouter};