
import { Router } from "express";
const cartRouter = Router();
// controllers
import * as controller from "./cart.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";
// models
// import { Address } from "../../../DB/models/index.js";

// get the required middlewares
const { errorHandler, auth } = middlewares;

cartRouter.post("/create/:productId", errorHandler(auth()), errorHandler(controller.addCart));
cartRouter.put('/remove/:productId', errorHandler(auth()), errorHandler(controller.removeCart));
cartRouter.put('/update/:productId', errorHandler(auth()), errorHandler(controller.updateCart));
cartRouter.get('/', errorHandler(auth()), errorHandler(controller.getCart));
export { cartRouter };