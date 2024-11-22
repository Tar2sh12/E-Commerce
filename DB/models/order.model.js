import mongoose from "mongoose";
import { OrderStatus, paymentMethods } from "../../src/utils/index.js";
import { Coupon, Product } from "./index.js";
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    fromCart: {
      type: Boolean,
      default: false,
    },
    address: String,
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    contactNumber: {
        type: String,
        required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shipingFee: {
        type: Number,
        required: true,
    },
    VAT: {
        type: Number,
        required: true,
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
    },
    total: {
      type: Number,
      required: true,
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(paymentMethods)
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus)
    },
    deliveredAt: Date,
    cancelledAt: Date,
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    payment_intent:String
  },
  { timestamps: true }
);

orderSchema.post('save', async function () {
  //decrement stock of products
  for (const product of this.products) {
    await Product.updateOne({ _id: product.productId }, { $inc: { stock: -product.quantity } });
  }
  //increment usageCount of coupon
  if(this.couponId){
    const coupon = await Coupon.findById( this.couponId);
    coupon.Users.find(u=>u.userId.toString()===this.userId.toString()).usageCount++;
    await coupon.save();
  }
})

export const Order = mongoose.models.Order || model("Order", orderSchema);
