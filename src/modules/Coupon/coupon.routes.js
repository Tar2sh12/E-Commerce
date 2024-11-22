import { Router } from "express";
const couponRouter = Router();
// controllers
import * as controller from "./coupon.controller.js";
// utils
import { extensions, roles, systemRoles } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";
// models
// import { Address } from "../../../DB/models/index.js";

// get the required middlewares
const { errorHandler, auth, validationMiddleware, authorizationMiddleware } =
  middlewares;
import { createCouponSchema, updateCouponSchema } from "./coupon.schema.js";

couponRouter.post(
  "/create",
  validationMiddleware(createCouponSchema),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.createCoupon)
);
couponRouter.put(
  "/update/:couponId",
  validationMiddleware(updateCouponSchema),
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.updateCoupon)
);
couponRouter.patch(
  "/enable/:couponId",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.disableEnableCoupon)
);

//? done authentication && authorization
couponRouter.get( 
  "/",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.getCoupons)
);
couponRouter.get(
  "/details/:couponId",
  errorHandler(auth()),
  errorHandler(authorizationMiddleware(systemRoles.ADMIN)),
  errorHandler(controller.getCouponById)
);
export { couponRouter };
