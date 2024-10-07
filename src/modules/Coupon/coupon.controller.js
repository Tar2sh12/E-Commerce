import { Coupon, CouponChangeLog, User } from "../../../DB/models/index.js";
import { ErrorClass } from "../../utils/error-class.utils.js";
import { createAddress } from "../Address/address.controller.js";
/**
 * @api {POST} /coupons/create create coupon
 */
export const createCoupon = async (req, res, next) => {
  const { couponCode, couponAmount, couponType, from, till, Users } = req.body;
  //couponCode check
  const isCouponCodeExist = await Coupon.findOne({ couponCode });
  if (isCouponCodeExist) {
    return next(
      new ErrorClass(
        "coupon code already exist",
        400,
        "coupon code already exist"
      )
    );
  }
  // $in operator
  const userIds = Users.map((user) => user.userId);
  const validUsers = await User.find({ _id: { $in: userIds } });
  if (validUsers.length !== userIds.length) {
    return next(new ErrorClass("invalid users", 400, "invalid users"));
  }
  const newCoupon = new Coupon({
    couponCode,
    couponAmount,
    couponType,
    from,
    till,
    Users,
    createdBy: req.authUser._id,
  });
  await newCoupon.save();
  res.status(200).json({ message: "coupon created successfully", newCoupon });
};
/**
 * @api {GET} /coupons get all coupons
 */
export const getCoupons = async (req, res, next) => {
  const { isEnable } = req.query;
  const filters = {};
  if (isEnable) {
    filters.isEnable = isEnable === "true" ? true : false;
  }
  const coupons = await Coupon.find(filters);
  res.status(200).json({ message: "coupons found", coupons });
};

/**
 * @api {GET} /coupons/:couponId get coupon by id
 */
export const getCouponById = async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.couponId);
  res.status(200).json({ message: "coupon found", coupon });
};

/**
 * @api {PUT} /coupons/:couponId update coupon
 */
export const updateCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const userId = req.authUser._id;
  const { couponCode, couponAmount, couponType, from, till, Users } = req.body;
  //coupon id check
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    return next(new ErrorClass("coupon not found", 404, "coupon not found"));
  }
  const logUpdatedObject = { couponId, updatedBy: userId, changes: {} };
  if (couponCode) {
    const isCouponCodeExist = await Coupon.findOne({ couponCode });
    if (isCouponCodeExist) {
      return next(
        new ErrorClass(
          "coupon code already exist",
          400,
          "coupon code already exist"
        )
      );
    }
    coupon.couponCode = couponCode;
    logUpdatedObject.changes.couponCode = couponCode;
  }

  if (from) {
    coupon.from = from;
    logUpdatedObject.changes.from = from;
  }
  if (till) {
    coupon.till = till;
    logUpdatedObject.changes.till = till;
  }
  if (couponAmount) {
    coupon.couponAmount = couponAmount;
    logUpdatedObject.changes.couponAmount = couponAmount;
  }
  if(couponType){
    coupon.couponType = couponType;
    logUpdatedObject.changes.couponType = couponType;
  }
  if(Users){
    const userIds = Users.map((user) => user.userId);
    const validUsers = await User.find({ _id: { $in: userIds } });
    if (validUsers.length !== userIds.length) {
      return next(new ErrorClass("invalid users", 400, "invalid users"));
    }
    coupon.Users = Users;
    logUpdatedObject.changes.Users = Users;
  }
  await coupon.save();
  await CouponChangeLog.create(logUpdatedObject);
  res.status(200).json({ message: "coupon updated successfully", coupon });
};
/**
 * @api {PATCH} /coupons/:couponId disable/enable coupon
 */
export const disableEnableCoupon = async (req, res, next) => {
    const { couponId } = req.params;
    const userId = req.authUser._id;
    const { enable } = req.body;
    //coupon id check
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return next(new ErrorClass("coupon not found", 404, "coupon not found"));
    }
    const logUpdatedObject = { couponId, updatedBy: userId, changes: {} };
    if(enable===true){
        coupon.isEnable = true;
        logUpdatedObject.changes.isEnable = true;
    }
    if(enable===false){
        coupon.isEnable = false;
        logUpdatedObject.changes.isEnable = false;
    }
    await coupon.save();
    const log = await CouponChangeLog.create(logUpdatedObject);
    res.status(200).json({ message: "coupon updated successfully", coupon ,log });
}
/**
 * @todo add apply coupon API after creating order
 * @api {POST} /coupons/apply apply coupon
 */
