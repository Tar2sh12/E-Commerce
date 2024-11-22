import { Router } from "express";
const orderRouter = Router();
// controllers
import * as controller from "./order.controller.js";
// utils
import { systemRoles } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";
// models

// get the required middlewares
const { errorHandler, auth, validationMiddleware, authorizationMiddleware } =
  middlewares;
import {
  createOrderSchema,
  cancelOrderSchema,
  deliveredOrderSchema,
} from "./order.schema.js";
orderRouter.post(
  "/create",
  errorHandler(validationMiddleware(createOrderSchema)),
  auth(),
  errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.createOrder)
);
orderRouter.put(
  "/cancel/:orderId",
  errorHandler(validationMiddleware(cancelOrderSchema)),
  auth(),
  errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.cancelOrder)
);
orderRouter.put(
  "/deliver/:orderId",
  errorHandler(validationMiddleware(deliveredOrderSchema)),
  auth(),
  errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.deliveredOrder)
);

orderRouter.get(
  "/",
  auth(),
  errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.listOrders)
);
orderRouter.post(
  "/stripePay/:orderId",
  errorHandler(validationMiddleware(deliveredOrderSchema)),
  auth(),
  errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.payWithStripe)
);
orderRouter.post("/webhook", errorHandler(controller.stripeWebhookLocal));

orderRouter.post(
  "/refund/:orderId",
  // auth(),
  // errorHandler(authorizationMiddleware(systemRoles.BUYER)),
  errorHandler(controller.refundPaymentData)
);
export { orderRouter };

/**
 * Automatically  refunf (after client cancel)
 * manual , by admin
 */
