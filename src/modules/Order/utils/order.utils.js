import { Coupon } from "../../../../DB/models/index.js"
import { DateTime } from "luxon";
import { DiscountType } from "../../../utils/index.js";
/** 
 * @param {*} couponCode 
 * @param {*} userId 
 * @returns {message: string , error: boolean, coupon: object}
 */
export const validateCoupon = async (couponCode, userId) => {
    // get coupon by coupon code 
    const coupon = await Coupon.findOne({ couponCode });
    if (!coupon) {
        return {
            message: "coupon not found",
            error: true
        }
    }
    //check if coupon is enable
    const now = DateTime.now();
    const till = DateTime.fromJSDate(coupon.till);
    if(!coupon.isEnable || now > till){
        return {
            message: "coupon is not enabled",
            error: true
        }
    }
    // not started yet 
    const from = DateTime.fromJSDate(coupon.from);
    if(now < from){
        return {
            message: `coupon not started yet , will start in ${from}`,
            error: true
        }
    }
    //check if coupon is valid for user
    const isUserNotEligible = coupon.Users.some((user)=> user.userId.toString() !== userId.toString() || ( user.userId.toString() === userId.toString() &&  user.maxCount <= user.usageCount));
    if(isUserNotEligible){
        return {
            message: "coupon is not valid for you",
            error: true
        }
    }
    return {
        message: "coupon is valid",
        error: false,
        coupon
    }
}

export const applyCoupon = (coupon, subTotal) => {
    let total = subTotal;
    const { couponType, couponAmount } = coupon;
    if(couponType == DiscountType.PERCENTAGE){
        total = subTotal - (subTotal * couponAmount / 100); 
    }
    else if(couponType == DiscountType.FIXED){
        if( subTotal>couponAmount){
            return total;
        }
        total = subTotal - couponAmount;
    }

    
    return total;
}
