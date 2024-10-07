import { Router } from "express";
const orderRouter = Router();
// controllers
import * as controller from "./order.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";
// models

// get the required middlewares
const { errorHandler, auth, validationMiddleware } = middlewares;
orderRouter.post("/create", auth(), errorHandler(controller.createOrder));
orderRouter.put(
  "/cancel/:orderId",
  auth(),
  errorHandler(controller.cancelOrder)
);
orderRouter.put(
  "deliver/:orderId",
  auth(),
  errorHandler(controller.deliveredOrder)
);
orderRouter.get("/", auth(), errorHandler(controller.listOrders));
orderRouter.post(
  "/stripePay/:orderId",
  auth(),
  errorHandler(controller.payWithStripe)
);
orderRouter.post("/webhook", errorHandler(controller.stripeWebhookLocal));
orderRouter.post("/refund/:orderId", auth(),errorHandler(controller.refundPaymentData));
export { orderRouter };
