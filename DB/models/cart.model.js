import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { calculateCartTotal } from "../../src/modules/Cart/Utils/cart.utils.js";
const cartSchema = new Schema(
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
          default: 1,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    subTotal: Number,
  },
  { timestamps: true }
);
cartSchema.pre("save", function (next) {

  
  this.subTotal = calculateCartTotal(this.products); 

  
  next();
})
cartSchema.post("save", async function (doc) {
  if(doc.products.length===0){
    await Cart.deleteOne({userId:doc.userId})
  }
})
export const Cart = mongoose.models.Cart || model("Cart", cartSchema);
