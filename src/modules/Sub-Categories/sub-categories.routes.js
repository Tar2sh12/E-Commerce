import * as controller from "./sub-categories.controller.js";
// middlewares
import * as Middlewares from "../../middleware/index.js";
// models
import { SubCategory } from "../../../DB/models/index.js";
// utils
import { extensions } from "../../utils/index.js";
import { Router } from "express";
const subCategoryRouter = Router();
const { errorHandler, getDocumentByName, multerHost ,auth} = Middlewares;

subCategoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(SubCategory),
  errorHandler(auth())
  ,
  errorHandler(controller.createSubCategory)
);

subCategoryRouter.get("/", errorHandler(controller.getSubCategory));

subCategoryRouter.put(
    "/update/:_id",
    multerHost({ allowedExtensions: extensions.Images }).single("image"),
    getDocumentByName(SubCategory),

    errorHandler(controller.updateSubCategory)
  );
  
  subCategoryRouter.delete(
    "/delete/:_id",
    errorHandler(controller.deleteSubCategory)
  );
  subCategoryRouter.get('/subcat-brand',errorHandler(controller.getSubCategories))
export {subCategoryRouter};