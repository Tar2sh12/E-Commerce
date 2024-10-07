import { Cart, Product } from "../../../DB/models/index.js";
import { ErrorClass } from "../../utils/index.js";
import { calculateCartTotal, checkProductStock } from "./Utils/cart.utils.js";
/**
 * @api {POST} /carts/add/:productId  Add to cart
 */
export const addCart = async (req, res, next) => {
  const userId = req.authUser._id;
  const { quantity } = req.body;
  const { productId } = req.params;
  const product = await checkProductStock(productId, quantity);
  if (!product) {
    return next(new ErrorClass("product not found", 404, "product not found"));
  }
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    let subTotal ;
    const newCart = new Cart({
      userId,
      products: [
        { productId: product._id, quantity, price: product.appliedPrice },
      ],
      subTotal,
    });
    await newCart.save();
    return res
      .status(201)
      .json({ msg: "product added to the cart successfully", newCart });
  }
  const isProductExist = cart.products.find((p) => p.productId == productId);
  if (isProductExist) {
    return next(
      new ErrorClass(
        "product already exist in the cart",
        400,
        "product already exist in the cart"
      )
    );
  }
  cart.products.push({
    productId: product._id,
    quantity,
    price: product.appliedPrice,
  });

  
  // cart.subTotal += product.appliedPrice * quantity;
  await cart.save();
  res.status(200).json({ msg: "product added to the cart successfully", cart });
};

/**
 * @api {PUT} /carts/remove/:productId  remove from cart
 */
export const removeCart = async (req, res, next) => {
  const userId = req.authUser._id;
  const { productId } = req.params;
  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart) {
    return next(
      new ErrorClass(
        "product not found in the cart",
        404,
        "product not found in the cart"
      )
    );
  }
  cart.products = cart.products.filter((p) => p.productId != productId);

  
  await cart.save();
  res
    .status(200)
    .json({ msg: "product removed from the cart successfully" });
};

/**
 * @api {PUT} /carts/update/:productId Update quantity of product and subtotal of the cart
 */
export const updateCart = async (req, res, next) => {
  const userId = req.authUser._id;
  const { quantity } = req.body;
  const { productId } = req.params;
  if(quantity < 1){
    return next(new ErrorClass("quantity must be greater than 0", 400, "quantity must be greater than 0"));
  }
  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart) {
    return next(
      new ErrorClass(
        "product not found in the cart",
        404,
        "product not found in the cart"
      )
    );
  }
  const product = await checkProductStock(productId, quantity);
  if (!product) {
    return next(new ErrorClass("product not found", 404, "product not found"));
  }
  const productIndex = cart.products.findIndex((p) => p.productId.toString() == product._id.toString());
  cart.products[productIndex].quantity = quantity;

  
  await cart.save();
  res
    .status(200)
    .json({ msg: "cart updated successfully", cart });
};

/**
 * @api {GET} /carts/ get cart
 */

export const getCart = async (req, res, next) => {
  const userId = req.authUser._id;
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(
      new ErrorClass(
        "cart not found",
        404,
        "cart not found"
      )
    );
  }
  res.status(200).json({ msg: "cart found", cart });
}