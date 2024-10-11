import { Review ,Product, Cart, Order} from "../../../DB/models/index.js";
import { ErrorClass, OrderStatus, ReviewStatus } from "../../utils/index.js";

export const addReview = async (req, res, next) => {
  const userId = req.authUser._id;
  const { productId } = req.params;
  const { reviewRating, reviewComment } = req.body;
  // check if the user reviewed this product
  const isAlreadyReviewed = await Review.findOne({ userId, productId });
  if (isAlreadyReviewed) {
    return next(
      new ErrorClass(
        "you already reviewed this product",
        400,
        "you already reviewed this product"
      )
    );
  }
  //check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorClass("product not found", 400, "product not found"));
  }
  //check if the user bought this product
  console.log(userId, productId);
  
  const isBought = await Order.findOne({
    userId,
    "products.productId": productId,
    orderStatus: OrderStatus.Delivered,
  });
  
  if (!isBought) {
    return next(
      new ErrorClass(
        "you must buy this product first",
        400,
        "you must buy this product first"
      )
    );
  }
  const review = {
    userId,
    productId,
    reviewRating,
    reviewComment,
  };
  const newReview = await Review.create(review);
  res.status(201).json({ msg: "review added", newReview });
};
 
export const listReviews = async (req, res, next) => {
    const userId = req.authUser._id;
    const review = await Review.find({userId,reviewStatus:ReviewStatus.Approved}).populate([
        {
            path: "userId",
            select: "userName email",
        },
        {
            path: "productId",
            select: "title",
        }
    ]).select("reviewRating reviewComment -_id");

    res.status(200).json({ msg: "review found", review });
}


// approve or reject review\
export const changeReviewStatus = async (req, res, next) => {
    const userId = req.authUser._id;
    const { reviewId } = req.params;
    const { status } = req.body;
    const review = await Review.findOne({ _id: reviewId }).populate('productId');
    if (!review) {
        return next(new ErrorClass("review not found", 404, "review not found"));
    }
    if(status!=ReviewStatus.Approved && status!=ReviewStatus.Rejected){
        return next(new ErrorClass("invalid status", 400, "invalid status"));
    } 
    if (review.productId.createdBy.toString() !== userId.toString()) {
        return next(new ErrorClass("you are not authorized", 403, "you are not authorized"));
    }

    review.reviewStatus = status;
    await review.save();
    res.status(200).json({ msg: "review status changed", review });
}