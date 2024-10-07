import { Router } from "express";
// controllers
import * as controller from "./brands.controller.js";
// middlewares
import * as Middlewares from "../../middleware/index.js";
// utils
import { extensions } from "../../utils/index.js";

const brandRouter = Router();
const { errorHandler, multerHost ,auth} = Middlewares;

brandRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(auth())
  ,
  errorHandler(controller.createBrand)
);

brandRouter.get("/", errorHandler(controller.getBrands));

brandRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(controller.updatebrand)
);

brandRouter.delete("/delete/:_id", errorHandler(controller.deleteBrand));

brandRouter.get('/brand-product',errorHandler(controller.getbrands))
brandRouter.get('/getBrandBySubCatName',errorHandler(controller.getBrandBySubCatName))
export { brandRouter };