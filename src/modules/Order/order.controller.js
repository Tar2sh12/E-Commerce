import { DateTime } from "luxon";
import { Address, Cart, Order, Product } from "../../../DB/models/index.js";
import {
  ApiFeature,
  ErrorClass,
  OrderStatus,
  paymentMethods,
} from "../../utils/index.js";
import { calculateCartTotal } from "../Cart/Utils/cart.utils.js";
import { applyCoupon, validateCoupon } from "./utils/order.utils.js";
import {
  confirmPaymentIntent,
  createCouponWithStripe,
  createCouponWithFeesWithStripe
  ,
  createPaymentIntentWithStripe,
  createSession,
  refundPayment,
} from "../../payment-handler/stripe.js";

export const createOrder = async (req, res, next) => {
  const userId = req.authUser._id;
  const {
    paymentMethod,
    address,
    addressId,
    contactNumber,
    shipingFee,
    VAT,
    couponCode,
  } = req.body;
  const cart = await Cart.findOne({ userId }).populate("products.productId");
  if (!cart || !cart.products.length) {
    return next(new ErrorClass("cart is empty", 400, "cart is empty"));
  }
  const isSoldOut = cart.products.find((p) => p.productId.stock < p.quantity);
  if (isSoldOut) {
    return next(
      new ErrorClass(
        `product ${isSoldout.productId.title} is sold out`,
        400,
        `product ${isSoldout.product.title} is sold out`
      )
    );
  }
  const subTotal = calculateCartTotal(cart.products);
  let total = subTotal + shipingFee + VAT;

  let coupon = null;
  if (couponCode) {
    const validCoupon = await validateCoupon(couponCode, userId);
    // console.log(validCoupon);
    if (validCoupon.error) {
      return next(
        new ErrorClass(validCoupon.message, 400, validCoupon.message)
      );
    }
    coupon = validCoupon.coupon;
    total = applyCoupon(coupon, subTotal);
    total = total + shipingFee + VAT;
  }

  if (addressId) {
    const addressInfo = await Address.findOne({ _id: addressId, userId });
    if (!addressInfo) {
      return next(
        new ErrorClass("address not found", 400, "address not found")
      );
    }
  }
  let orderStatus = OrderStatus.Pending;
  if (paymentMethod === paymentMethods.Cash) {
    orderStatus = OrderStatus.Placed;
  }

  const orderObjs = new Order({
    userId,
    products: cart.products,
    address,
    addressId,
    contactNumber,
    subTotal,
    shipingFee,
    VAT,
    couponId: coupon?._id,
    total,
    paymentMethod,
    orderStatus,
    estimatedDeliveryDate: DateTime.now()
      .plus({ days: 3 })
      .toFormat("yyyy-MM-dd"),
  });
  await orderObjs.save();

  //clear cartؤ
  cart.products = [];
  await cart.save();
  //decrement stock of products
  //increment usageCount of coupon

  // response
  res.status(201).json({
    message: "order created successfully",
    orderObjs,
  });
};

export const cancelOrder = async (req, res, next) => {
  const userId = req.authUser._id;
  const { orderId } = req.params;
  const order = await Order.findOne({
    _id: orderId,
    userId,
    orderStatus: {
      $in: [OrderStatus.Pending, OrderStatus.Placed, OrderStatus.Confirmed],
    },
  });
  if (!order) {
    return next(new ErrorClass("order not found", 404, "order not found"));
  }
  const orderDate = DateTime.fromJSDate(order.createdAt);
  const now = DateTime.now();
  const diff = Math.ceil(
    Number(now.diff(orderDate, "days").toObject.days).toFixed(2)
  );
  if (diff > 3) {
    return next(
      new ErrorClass(
        "order is too old to be cancelled",
        400,
        "order is too old to be cancelled"
      )
    );
  }

  order.orderStatus = OrderStatus.Cancelled;
  order.cancelledAt = DateTime.now();
  order.cancelledBy = userId;
  await Order.updateOne({ _id: orderId }, order);
  // update stock of products
  for (const product of order.products) {
    const prod = await Product.findByIdAndUpdate(
      product.productId,
      { $inc: { stock: product.quantity } },
      { new: true }
    );
  }
  res.status(200).json({ msg: "order cancelled successfully", order });
};

export const deliveredOrder = async (req, res, next) => {
  const userId = req.authUser._id;
  const { orderId } = req.params;
  const order = await Order.findOne({
    _id: orderId,
    userId,
    orderStatus: { $in: [OrderStatus.Placed, OrderStatus.Confirmed] },
  });
  if (!order) {
    return next(new ErrorClass("order not found", 404, "order not found"));
  }

  order.orderStatus = OrderStatus.Delivered;
  order.deliveredAt = DateTime.now();
  order.deliveredBy = userId;
  await Order.updateOne({ _id: orderId }, order);
  res.status(200).json({ msg: "order delivered successfully", order });
};

/**
 * @api {get} /orders/list  list all orders
 *
 */
export const listOrders = async (req, res, next) => {
  const userId = req.authUser._id;
  const query = { userId, ...req.query };
  const populateArray = [
    {
      path: "products.productId",
      select: "title Images rating appliedPrice",
    },
  ];
  const list = new ApiFeature(Order, query, populateArray)
    .filters()
    .sort()
    .pagination();
  const orders = await list.mongooseQuery;
  res.status(200).json({
    status: "success",
    message: "orders list",
    data: orders,
  });
};

export const payWithStripe = async (req, res, next) => {
  const userId = req.authUser._id;
  const { orderId } = req.params;
  const order = await Order.findOne({
    _id: orderId,
    userId,
    orderStatus: OrderStatus.Pending,
  }).populate("products.productId");
  if (!order) {
    return next(new ErrorClass("order not found", 404, "order not found"));
  }
  const paymentObject = {
    customer_email: req.authUser.email,
    metadata: { orderId: order._id.toString() }, // meta data accept only preemptive data types
    discounts: [],
    line_items: order.products.map((product) => {
      return {
        price_data: {
          currency: "egp",
          unit_amount: product.price * 100, // from cents to pound
          product_data: {
            name: product.productId.title,
          },
        },
        quantity: product.quantity,
      };
    }),
  };
  // Manual way to add tax to the order
  paymentObject.line_items.push({
    price_data: {
      currency: "egp",
      product_data: {
        name: "Tax", // Name of the tax item
      },
      unit_amount: (order.VAT + order.shipingFee) * 100, // $5.00 fixed tax (amount in cents)
    },
    quantity: 1,
  });
  //create coupon
  if (order.couponId) {
    // const fees=order.VAT+order.shipingFee;
    // const stripeCoupon = await createCouponWithFeesWithStripe({
    //   couponId: order.couponId,
    //   fees,
    //   subtotal: order.subTotal
    // });
    
    const stripeCoupon = await createCouponWithStripe({
      couponId: order.couponId,
    });
    
    if (stripeCoupon.status) {
      return next(new ErrorClass(stripeCoupon.msg, 400, stripeCoupon.msg));
    }
    paymentObject.discounts.push({ coupon: stripeCoupon.id });
  }

  // console.log(paymentObject);

  const checkOutSession = await createSession(paymentObject);
  // const paymentIntent = await createPaymentIntentWithStripe({
  //   amount: order.subTotal,
  //   currency: "egp",
  // });

  // order.payment_intent = paymentIntent.id;
  // console.log("order",order.payment_intent);
  // await Order.updateOne({ _id: orderId }, order);
  res.status(200).json({ msg: "payment initialized", checkOutSession });
};

export const stripeWebhookLocal = async (req, res, next) => {
  // const confirmOrder = await Order.findByIdAndUpdate(orderId, {
  //   orderStatus: OrderStatus.Confirmed,
  // });

  // console.log({ payment_intent_from_db: req.body.data.object.payment_intent });
  // Single Source of truth
  const payment_intent = req.body.data.object.payment_intent;
  console.log(req.body);
  // const confirmPayment = await confirmPaymentIntent({
  //   paymentIntentId: payment_intent,
  // });

  const orderId = req.body.data.object.metadata.orderId;
  await Order.findByIdAndUpdate(orderId, {
    orderStatus: OrderStatus.Confirmed,
    payment_intent: payment_intent,
  });
  res.status(200).json({ msg: "payment success" });
};

export const refundPaymentData = async (req, res, next) => {
  const { orderId } = req.params;
  const findOrder = await Order.findOne({
    _id: orderId,
    orderStatus: OrderStatus.Confirmed,
  });

  if (!findOrder) {
    return next(new ErrorClass("order not found", 404, "order not found"));
  }
  const refund = await refundPayment({
    paymentIntentId: findOrder.payment_intent,
  });
  if (refund.status !== "succeeded") {
    return next(new ErrorClass(refund.message, 400, refund.message));
  }
  findOrder.orderStatus = OrderStatus.Refunded;
  await Order.updateOne({ _id: orderId }, findOrder);
  res.status(200).json({ msg: "payment refunded successfully" });
};
