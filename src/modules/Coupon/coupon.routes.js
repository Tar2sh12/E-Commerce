import { Router } from "express";
const couponRouter = Router();
// controllers
import * as controller from "./coupon.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../middleware/index.js";
// models
// import { Address } from "../../../DB/models/index.js";

// get the required middlewares
const { errorHandler, auth , validationMiddleware} = middlewares;
import { createCouponSchema, updateCouponSchema } from "./coupon.schema.js";

couponRouter.post(
    "/create",
    errorHandler(auth()),
    validationMiddleware(createCouponSchema),
    errorHandler(controller.createCoupon)
);
couponRouter.put(
    "/update/:couponId",
    errorHandler(auth()),
    validationMiddleware(updateCouponSchema),
    errorHandler(controller.updateCoupon)
);
couponRouter.patch(
        "/enable/:couponId",
    errorHandler(auth()),
    errorHandler(controller.disableEnableCoupon)
);

// todo authentication && authorization
couponRouter.get("/", errorHandler(controller.getCoupons));
couponRouter.get("/details/:couponId", errorHandler(controller.getCouponById));
export { couponRouter };