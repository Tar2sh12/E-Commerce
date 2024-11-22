import { Coupon } from "../../../../DB/models/index.js";
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
      error: true,
    };
  }
  //check if coupon is enable
  const now = DateTime.now();
  const till = DateTime.fromJSDate(coupon.till);
  if (!coupon.isEnable || now > till) {
    return {
      message: "coupon is not enabled",
      error: true,
    };
  }
  // not started yet
  const from = DateTime.fromJSDate(coupon.from);
  if (now < from) {
    return {
      message: `coupon not started yet , will start in ${from}`,
      error: true,
    };
  }
  //check if coupon is valid for user
  const isUserNotEligible = coupon.Users.some(
    (user) =>
      user.userId.toString() !== userId.toString() ||
      (user.userId.toString() === userId.toString() &&
        user.maxCount <= user.usageCount)
  );
  if (isUserNotEligible) {
    return {
      message: "coupon is not valid for you",
      error: true,
    };
  }
  return {
    message: "coupon is valid",
    error: false,
    coupon,
  };
};

export const applyCoupon = (coupon, subTotal) => {
  let total = subTotal;
  const { couponType, couponAmount } = coupon;
  if (couponType == DiscountType.PERCENTAGE) {
    total = subTotal - (subTotal * couponAmount) / 100;
  } else if (couponType == DiscountType.FIXED) {
    if (subTotal > couponAmount) {
      return total;
    }
    total = subTotal - couponAmount;
  }

  return total;
};
// Create automatically tax rate in stripe
// async function createTaxRate() {
//   try {
//     // Create a tax rate
//     const taxRate = await stripe.taxRates.create({
//       display_name: "Sales Tax", // The name of the tax, e.g., "Sales Tax"
//       description: "Sales tax for US customers", // Optional: description of the tax
//       jurisdiction: "US", // Optional: where this tax applies
//       percentage: 10, // The percentage of the tax (e.g., 10%)
//       inclusive: false, // Set to `true` if tax is included in the price, `false` if it’s added on top
//     });

//     console.log("Tax Rate Created:", taxRate);
//     return taxRate.id; // Return the tax rate ID to use in the Checkout session
//   } catch (error) {
//     console.error("Error creating tax rate:", error);
//   }
// }

// Create the Stripe Checkout session with the tax rate
// const session = await stripe.checkout.sessions.create({
//   payment_method_types: ["card"],
//   line_items: line_items,
//   mode: "payment",
//   success_url: `${req.protocol}://${req.get("host")}/success`,
//   cancel_url: `${req.protocol}://${req.get("host")}/cancel`,
//   automatic_tax: { enabled: true }, // Enable automatic tax calculation
//   tax_rates: [taxRateId], // Add the dynamically created tax rate here
// });
