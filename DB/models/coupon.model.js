import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { CouponTypes } from "../../src/utils/index.js";
const couponSchema = new Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true,
    },
    couponAmount: {
        type: Number,
        required: true,   
    },
    couponType: {
        type: String,
        required: true,
        enum: Object.values(CouponTypes),
    },
    from:{
        type: Date,
        required: true,
    },
    till:{
        type: Date,
        required: true,
    },
    Users:[
        {
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required:true
            },
            maxCount:{
                type: Number,
                required: true,
                min:1
            },
            usageCount:{
                type: Number,
                default: 0
            }
        }
    ],
    isEnable:{
        type: Boolean,
        default: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export const Coupon= mongoose.models.Coupon || model("Coupon", couponSchema);

//create coupon change log table
// couponId , userId , changes:{}
const couponChangeLogSchema = new Schema({
    couponId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
        required: true
    },
    updatedBy:{    
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    changes:{
        type: Object,
        required: true
    }
},{timestamps: true});

export const CouponChangeLog= mongoose.models.CouponChangeLog || model("CouponChangeLog", couponChangeLogSchema)