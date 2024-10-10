import { nanoid } from "nanoid";
import slugify from "slugify";
// models
import { Product,User } from "../../../DB/models/index.js";
// utils
import {
  ApiFeature,
  calculateProductPrice,
  ErrorClass,
  uploadFile,
  cloudinaryConfig,
  ReviewStatus,
  getIo
} from "../../utils/index.js";

/**
 * @api {post} /products/add  Add Product
 */
export const addProduct = async (req, res, next) => {
  // destructuring the request body
  const { title, overview, specs, price, discountAmount, discountType, stock } =
    req.body;
  // req,files
  if (!req.files.length)
    return next(new ErrorClass("No images uploaded", { status: 400 }));
  
  const createdBy  =req.authUser._id;

  // Ids check
  const brandDocument = req.document;
  if(!brandDocument.createdBy.equals(createdBy)){
    return next(
      new ErrorClass("Unauthorized Action", 401, "Unauthorized Action")
    );
  }
  // Images section
  // Access the customIds from the brandDocument
  const brandCustomId = brandDocument.customId;
  const catgeoryCustomId = brandDocument.categoryId.customId;
  const subCategoryCustomId = brandDocument.subCategoryId.customId;

  const customId = nanoid(4);
  const folder = `${process.env.UPLOADS_FOLDER}/Categories/${catgeoryCustomId}/SubCategories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${customId}`;

  // upload each file to cloudinary
  const URLs = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await uploadFile({
      file: file.path,
      folder,
    });
    URLs.push({ secure_url, public_id });
  }

  // prepare product object
  const productObject = {
    title,
    overview,
    specs: JSON.parse(specs),
    price,
    appliedDiscount: {
      amount: discountAmount,
      type: discountType,
    },
    stock,
    Images: {
      URLs,
      customId,
    },
    categoryId: brandDocument.categoryId._id,
    subCategoryId: brandDocument.subCategoryId._id,
    brandId: brandDocument._id,
    createdBy
  };

  // create in db
  const newProduct = await Product.create(productObject);
  //socket io
  getIo().emit("newProduct",{message:"new product created"});
  // send the response
  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: newProduct,
  });
};

/**
 * @api {put} /products/update/:productId  Update Product
 * @todo Upload images to cloudinary and db
 */
export const updateProduct = async (req, res, next) => {
  // productId from params
  const { productId } = req.params;
  // destructuring the request body
  const {
    title,
    stock,
    overview,
    badge,
    price,
    discountAmount,
    discountType,
    specs,
    public_id,
  } = req.body;
  // check if the product is exist
  const product = await Product.findById(productId)
    .populate("categoryId")
    .populate("subCategoryId")
    .populate("brandId");
  if (!product)
    return next(new ErrorClass("Product not found", { status: 404 }));


  const createdBy  =req.authUser._id;
  if(!product.createdBy.equals(createdBy)){
    return next(
      new ErrorClass("Unauthorized Action", 401, "Unauthorized Action")
    );
  }
  // update the product title and slug
  if (title) {
    product.title = title;
    product.slug = slugify(title, {
      replacement: "_",
      lower: true,
    });
  }
  // update the product stock, overview, badge
  if (stock) product.stock = stock;
  if (overview) product.overview = overview;
  if (badge) product.badge = badge;

  // update the product price and discount
  if (price || discountAmount || discountType) {
    const newPrice = price || product.price;
    const discount = {};
    discount.amount = discountAmount || product.appliedDiscount.amount;
    discount.type = discountType || product.appliedDiscount.type;

    product.appliedPrice = calculateProductPrice(newPrice, discount);

    product.price = newPrice;
    product.appliedDiscount = discount;
  }

  // update the product specs
  if (specs) product.specs = specs;
  if (req.file && public_id) {
    const urlsArray = product.Images.URLs;
    const index = urlsArray.findIndex((obj) => obj.public_id === public_id);
    //console.log(urlsArray, index, urlsArray[index]);
    const splitedPublicId = urlsArray[index].public_id.split(
      `${product.Images.customId}/`
    )[1];
    const { secure_url } = await uploadFile({
      file: req.file.path,
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${product.categoryId.customId}/SubCategories/${product.subCategoryId.customId}/Brands/${product.brandId.customId}/Products/${product.Images.customId}`,
      publicId: splitedPublicId,
    });
    product.Images.URLs[index].secure_url = secure_url;
  }
  // save the product changes
  await product.save();
  // send the response
  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
};

/**
 * @todo @api {delete} /products/delete/:productId  Delete Product
 */
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

 
  
  // delete the product from db
  const product = await Product.findOneAndDelete({_id:id,createdBy:req.authUser._id}).populate('categoryId').populate('subCategoryId').populate('brandId');
  if (!product) {
    return next(new ErrorClass("product not found", 404, "product not found"));
  }
  const productPath = `${process.env.UPLOADS_FOLDER}/Categories/${product.categoryId.customId}/SubCategories/${product.subCategoryId.customId}/Brands/${product.brandId.customId}/Products/${product.Images.customId}`;
  //console.log(productPath);
  await cloudinaryConfig().api.delete_resources_by_prefix(productPath);
  await cloudinaryConfig().api.delete_folder(productPath);
  res.status(200).json({
    status: "success",
    message: "product deleted successfully",
  });
};

/**
 * @api {get} /products/list  list all Products
 *
 */
export const listProducts = async (req, res, next) => {
  const list = new ApiFeature(Product, req.query,[
    {path:'Reviews',match:{reviewStatus:ReviewStatus.Approved}}
  ]).filters().sort().pagination();
  const products = await list.mongooseQuery;
  res.status(200).json({
    status: "success",
    message: "Products list",
    data: products,
  });
};


/**
 * @api {get} /products/get/:productId get product by id
 *
 */
export const getProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId).populate('categoryId').populate('subCategoryId').populate('brandId');
  if (!product) {
    return next(new ErrorClass("product not found", 404, "product not found"));
  }
  res.status(200).json({
    status: "success",
    message: "product found",
    data: product,
  });
}