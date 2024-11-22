import Stripe from "stripe"; //Stripe is class
import { CouponTypes, ErrorClass } from "../utils/index.js";
import { Coupon } from "../../DB/models/index.js";

export const createSession = async ({
  customer_email,
  metadata,
  discounts,
  line_items,
}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], //default
    mode: "payment",
    customer_email,
    metadata,
    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL,
    discounts,
    line_items,
  });
  return session;
};

export const createCouponWithStripe = async ({ couponId }) => {
  //https://docs.stripe.com/api/coupons/object?lang=node => link to the documentation of stripe that contains coupon section
  const findCoupon = await Coupon.findById(couponId);
  if (!findCoupon) {
    return next(new ErrorClass("coupon not found", 404, "coupon not found"));
  }
  let couponObject = {};
  if (findCoupon.couponType == CouponTypes.AMOUNT) {
    couponObject = {
      name: findCoupon.couponCode,
      amount_off: findCoupon.couponAmount * 100,
      currency: "egp",
    };
  } else if (findCoupon.couponType == CouponTypes.PERCENTAGE) {
    couponObject = {
      name: findCoupon.couponCode,
      percent_off: findCoupon.couponAmount,
    };
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const stripeCoupon = await stripe.coupons.create(couponObject);
  return stripeCoupon;
};

//create payment method
export const createPaymentMethodWithStripe = async ({ token }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      token,
    },
  });
  return paymentMethod;
};

export const createPaymentIntentWithStripe = async ({ amount, currency }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentMethod = await createPaymentMethodWithStripe({
    token: "tok_visa",
  });
  // console.log({msg:"payment method created",paymentMethod});

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
    payment_method: paymentMethod.id,
  });
  return paymentIntent;
};
//retrieve payment intent
export const retrievePaymentIntentWithStripe = async ({ paymentIntentId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  // console.log("retrieve",paymentIntent);

  return paymentIntent;
};
// confirm payment intent
export const confirmPaymentIntent = async ({ paymentIntentId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentDetails = await retrievePaymentIntentWithStripe({
    paymentIntentId,
  });
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentDetails.payment_method,
  });
  // console.log('confirm',paymentIntent);

  return paymentIntent;
};

export const refundPayment = async ({ paymentIntentId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });
  return refund;
};
