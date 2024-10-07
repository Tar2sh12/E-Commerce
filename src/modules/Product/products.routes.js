import { Router } from "express";
const productRouter = Router();

// controllers
import * as controller from "./products.controller.js";
// middlewares
import * as Middlewares from "../../middleware/index.js";
// utils
import { extensions } from "../../utils/index.js";
// models
import { Brand } from "../../../DB/models/index.js";

const { errorHandler, multerHost, checkIfIdsExit ,auth} = Middlewares;

productRouter.post(
  "/add",
  multerHost({ allowedExtensions: extensions.Images }).array("image", 5),
  checkIfIdsExit(Brand),
  errorHandler(auth())
  ,
  errorHandler(controller.addProduct)
);

productRouter.put("/update/:productId",multerHost({ allowedExtensions: extensions.Images }).single("image"), errorHandler(controller.updateProduct));

productRouter.get("/list", errorHandler(controller.listProducts));

productRouter.delete("/delete/:id",errorHandler(controller.deleteProduct));

productRouter.get("/get/:productId", errorHandler(controller.getProduct));
export {productRouter};