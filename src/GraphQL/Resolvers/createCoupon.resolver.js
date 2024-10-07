import {Coupon} from '../../../DB/models/index.js'
import { validate ,isAuthQL} from '../Middlewares/index.js';
import { createCouponGraphQLSchema } from '../Validators/index.js';
export const createCoupon = async (parent, args) => {

    const { couponCode, couponAmount, couponType, from, till, Users , token } = args;
    //=====================authentication================
    const authUser = await isAuthQL(token);
    if(authUser instanceof Error){
        throw new Error(authUser);
    }

    
    if(authUser?.isUserExists.userType !== "Admin"){
        return new Error("you are not admin");
    }
    // ====================validation======================

    const validationArgs = await validate(createCouponGraphQLSchema, args);

    
    if (validationArgs !== true) {
        return new Error(JSON.stringify(validationArgs));
    }
    const newCoupon = new Coupon({ couponCode, couponAmount, couponType, from, till, Users ,createdBy:authUser?.isUserExists._id});
    await newCoupon.save();
    return newCoupon;
}